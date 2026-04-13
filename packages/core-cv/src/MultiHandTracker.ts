// ── MultiHandTracker.ts ────────────────────────────────────────────────────
// Identity engine per il sistema multi-hand di Salvagente.
//
// Funzionamento:
//   - Riceve MultiHandFrame ogni frame da SalvagenteCore
//   - Mantiene fino a MAX_HANDS = 8 slot con identità stabile nel tempo
//   - Usa nearest-neighbor matching con hysteresis per evitare flicker
//   - Ogni slot ha il proprio Smoother e PinchDetector isolati
//   - Quando il mouse è attivo, tutti gli slot vengono silenziati
//   - Notifica i subscriber via callback (zero React state ad alta frequenza)
// ──────────────────────────────────────────────────────────────────────────

import type { MultiHandFrame, MultiRawHand, HandSlot, Point2D, Point3D } from '@salvagente/shared-types';

// ── Costanti ──────────────────────────────────────────────────
const MAX_HANDS = 8;

/** Frame consecutivi senza match prima che uno slot vada inattivo. */
const HOLD_FRAMES = 8;

/** Distanza normalizzata massima per riusare l'identità di uno slot esistente. */
const MAX_MATCH_DISTANCE = 0.28;

/** Fattore di smoothing per il pointer di ogni mano. */
const SMOOTH_FACTOR = 0.3;

/** Soglia pinch: distanza normalizzata tra pollice (4) e indice (8). */
const PINCH_CLOSE = 0.05;
const PINCH_OPEN  = 0.09;

// ── Palette colori per slot (HSL, stabile per index) ─────────
export const HAND_SLOT_COLORS: readonly string[] = [
  '#7C3AED', // viola   — slot 0
  '#2563EB', // blu     — slot 1
  '#059669', // verde   — slot 2
  '#D97706', // ambra   — slot 3
  '#DC2626', // rosso   — slot 4
  '#DB2777', // rosa    — slot 5
  '#0891B2', // cyan    — slot 6
  '#65A30D', // lime    — slot 7
] as const;

// ── Tipi interni ──────────────────────────────────────────────
type SlotSubscriber = (slots: readonly HandSlot[]) => void;

interface InternalSlot {
  slot: HandSlot;
  missFrames: number;
  // Smoother separato per questo slot
  smoothX: number;
  smoothY: number;
  // Pinch hysteresis
  pinchState: boolean;
  lastPinchStrength: number;
}

// ── Utility ───────────────────────────────────────────────────
let _idCounter = 0;
function newHandId(): string {
  return `hand-${Date.now()}-${_idCounter++}`;
}

function dist2D(a: Point2D, b: Point2D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function smooth(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

/** Estrae il pointer dell'indice (landmark 8) normalizzato. */
function indexPointer(landmarks: Point3D[]): Point2D {
  const lm = landmarks[8];
  if (!lm) return { x: 0.5, y: 0.5 };
  return { x: lm.x, y: lm.y };
}

/** Calcola la pinch strength tra pollice (4) e indice (8). */
function pinchStrength(landmarks: Point3D[]): number {
  const thumb = landmarks[4];
  const index = landmarks[8];
  if (!thumb || !index) return 0;
  const dx = thumb.x - index.x;
  const dy = thumb.y - index.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  // Mappa [PINCH_CLOSE .. PINCH_OPEN] → [1 .. 0]
  return 1 - Math.min(1, Math.max(0, (dist - PINCH_CLOSE) / (PINCH_OPEN - PINCH_CLOSE)));
}

// ── MultiHandTracker ──────────────────────────────────────────
export class MultiHandTracker {
  private internalSlots: InternalSlot[] = [];
  private subscribers: Set<SlotSubscriber> = new Set();
  private mouseActive = false;

  constructor() {
    // Inizializza MAX_HANDS slot vuoti
    for (let i = 0; i < MAX_HANDS; i++) {
      this.internalSlots.push(this.createEmptySlot(i));
    }
  }

  // ── API pubblica ────────────────────────────────────────────

  /**
   * Processa un frame di dati dal core.
   * Chiamare ad ogni `multiHandUpdate`.
   */
  processFrame(frame: MultiHandFrame): void {
    if (this.mouseActive) {
      // Quando il mouse è attivo, silenziamo tutte le mani
      this.silenceAllSlots(frame.timestamp);
      this.notify();
      return;
    }

    this.matchAndUpdate(frame.hands, frame.timestamp);
    this.notify();
  }

  /** Segnala che il mouse è stato usato → spegni tutte le mani. */
  setMouseActive(active: boolean): void {
    this.mouseActive = active;
    if (active) {
      // Reset immediato di tutti gli slot
      for (const is of this.internalSlots) {
        if (is.slot.active) {
          is.slot = { ...is.slot, active: false };
          is.missFrames = 0;
        }
      }
      this.notify();
    }
  }

  get isMouseActive(): boolean {
    return this.mouseActive;
  }

  /** Snapshot immutabile degli slot correnti. */
  getSlots(): readonly HandSlot[] {
    return this.internalSlots.map(is => is.slot);
  }

  /** Slot attivi (mani attualmente tracked). */
  getActiveSlots(): HandSlot[] {
    return this.internalSlots.filter(is => is.slot.active).map(is => is.slot);
  }

  /** Iscriviti alle notifiche. Restituisce unsubscribe. */
  subscribe(cb: SlotSubscriber): () => void {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  // ── Logica interna ──────────────────────────────────────────

  private silenceAllSlots(timestamp: number): void {
    for (const is of this.internalSlots) {
      if (is.slot.active) {
        is.missFrames = HOLD_FRAMES + 1;
        is.slot = { ...is.slot, active: false, lastSeenAt: timestamp };
      }
    }
  }

  /**
   * Nearest-neighbor matching con hysteresis:
   * 1. Per ogni mano rilevata, trova lo slot attivo più vicino
   * 2. Se troppo lontano → assegna slot libero
   * 3. Slot non matchati incrementano missFrames → inattivi dopo HOLD_FRAMES
   */
  private matchAndUpdate(detected: MultiRawHand[], timestamp: number): void {
    const usedSlotIndices = new Set<number>();
    const usedDetectedIndices = new Set<number>();

    // Calcola pointer per ogni mano rilevata
    const detectedPointers: Point2D[] = detected.map(h => indexPointer(h.landmarks));

    // Step 1: abbina mani rilevate agli slot attivi
    const activeSlotIndices = this.internalSlots
      .map((_, i) => i)
      .filter(i => this.internalSlots[i].slot.active);

    // Per ogni slot attivo, trova la mano più vicina
    for (const slotIdx of activeSlotIndices) {
      const is = this.internalSlots[slotIdx];
      const slotPtr = is.slot.smoothedPointer;

      let bestDist = MAX_MATCH_DISTANCE;
      let bestDetIdx = -1;

      for (let d = 0; d < detected.length; d++) {
        if (usedDetectedIndices.has(d)) continue;
        const d2 = dist2D(slotPtr, detectedPointers[d]);
        if (d2 < bestDist) {
          bestDist = d2;
          bestDetIdx = d;
        }
      }

      if (bestDetIdx >= 0) {
        // Match trovato → aggiorna slot
        usedDetectedIndices.add(bestDetIdx);
        usedSlotIndices.add(slotIdx);
        this.updateSlot(is, detected[bestDetIdx], timestamp);
      }
    }

    // Step 2: mani non matchate → nuovi slot
    for (let d = 0; d < detected.length; d++) {
      if (usedDetectedIndices.has(d)) continue;

      // Cerca slot libero
      const freeIdx = this.internalSlots.findIndex(
        (is, i) => !is.slot.active && !usedSlotIndices.has(i)
      );
      if (freeIdx < 0) continue; // Tutti gli slot occupati

      const is = this.internalSlots[freeIdx];
      const ptr = detectedPointers[d];
      // Reset smoother alla posizione attuale
      is.smoothX = ptr.x;
      is.smoothY = ptr.y;
      is.missFrames = 0;
      is.pinchState = false;
      is.slot = {
        ...is.slot,
        handId: newHandId(),
        active: true,
        lastSeenAt: timestamp,
        landmarks: detected[d].landmarks,
        handedness: detected[d].handedness,
        rawConfidence: detected[d].confidence,
        smoothedPointer: ptr,
        velocity: { x: 0, y: 0 },
        isPinching: false,
        pinchStrength: 0,
        gestureState: 'idle',
      };

      usedSlotIndices.add(freeIdx);
    }

    // Step 3: slot non matchati → incrementa miss → eventuale inattivazione
    for (let i = 0; i < this.internalSlots.length; i++) {
      const is = this.internalSlots[i];
      if (!is.slot.active) continue;
      if (usedSlotIndices.has(i)) continue;

      is.missFrames++;
      if (is.missFrames > HOLD_FRAMES) {
        is.slot = { ...is.slot, active: false };
      }
    }
  }

  private updateSlot(is: InternalSlot, raw: MultiRawHand, timestamp: number): void {
    const ptr = indexPointer(raw.landmarks);

    // Smooth pointer
    const prevX = is.smoothX;
    const prevY = is.smoothY;
    is.smoothX = smooth(is.smoothX, ptr.x, SMOOTH_FACTOR);
    is.smoothY = smooth(is.smoothY, ptr.y, SMOOTH_FACTOR);

    const velocity: Point2D = {
      x: is.smoothX - prevX,
      y: is.smoothY - prevY,
    };

    // Pinch con hysteresis
    const strength = pinchStrength(raw.landmarks);
    let newPinch = is.pinchState;
    if (!is.pinchState && strength > 0.75) newPinch = true;
    if (is.pinchState  && strength < 0.35) newPinch = false;

    is.pinchState = newPinch;
    is.missFrames = 0;

    is.slot = {
      ...is.slot,
      active: true,
      lastSeenAt: timestamp,
      landmarks: raw.landmarks,
      handedness: raw.handedness,
      rawConfidence: raw.confidence,
      smoothedPointer: { x: is.smoothX, y: is.smoothY },
      velocity,
      isPinching: newPinch,
      pinchStrength: strength,
      gestureState: newPinch ? 'pinch' : 'open_palm',
    };
  }

  private notify(): void {
    const snapshot = this.getSlots();
    for (const cb of this.subscribers) {
      cb(snapshot);
    }
  }

  private createEmptySlot(index: number): InternalSlot {
    return {
      slot: {
        handId: '',
        slotIndex: index,
        active: false,
        lastSeenAt: 0,
        landmarks: [],
        handedness: 'Unknown',
        rawConfidence: 0,
        smoothedPointer: { x: 0.5, y: 0.5 },
        velocity: { x: 0, y: 0 },
        isPinching: false,
        pinchStrength: 0,
        gestureState: 'idle',
      },
      missFrames: 0,
      smoothX: 0.5,
      smoothY: 0.5,
      pinchState: false,
      lastPinchStrength: 0,
    };
  }
}

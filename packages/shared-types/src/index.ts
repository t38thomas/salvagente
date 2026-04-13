export interface Point2D { x: number; y: number; }
export interface Point3D extends Pick<Point2D, 'x' | 'y'> { z: number; }

export type GestureType = 'idle' | 'pinch' | 'open_palm' | 'closed_fist';

export interface CursorState {
  position: Point2D; 
  isPinching: boolean;
  isHandPresent: boolean;
  activeGesture: GestureType;
  extendedFingersCount: number;
}

export interface RawSkeleton {
  landmarks: Point3D[];
  handedness: 'Left' | 'Right';
  score: number;
}

// ── Multi-hand types ──────────────────────────────────────────

/** Dato grezzo per una singola mano nel frame corrente (da MediaPipe). */
export interface MultiRawHand {
  landmarks: Point3D[];
  handedness: 'Left' | 'Right' | 'Unknown';
  confidence: number;
}

/**
 * Slot stabile che rappresenta una mano con identità persistente nel tempo.
 * MAX_HANDS = 8 slot numerati 0-7.
 */
export interface HandSlot {
  /** UUID stabile nel tempo (non cambia per tutta la vita della mano). */
  handId: string;
  /** Indice fisso nello slot array [0-7]. */
  slotIndex: number;
  /** Mano attualmente tracked. */
  active: boolean;
  /** Timestamp dell'ultimo frame in cui questa mano è stata vista. */
  lastSeenAt: number;

  /** Landmark grezzi (21 punti MediaPipe, normalizzati 0..1). */
  landmarks: Point3D[];
  handedness: 'Left' | 'Right' | 'Unknown';
  rawConfidence: number;

  /** Posizione smoothed dell'indice (landmark 8), normalizzata 0..1. */
  smoothedPointer: Point2D;
  /** Velocità derivata del pointer (delta normalizzato / frame). */
  velocity: Point2D;

  /** Stato pinch per questa mano. */
  isPinching: boolean;
  pinchStrength: number; // 0..1

  gestureState: GestureType;
}

/** Evento emesso dal core ogni frame con i dati di tutte le mani rilevate. */
export interface MultiHandFrame {
  hands: MultiRawHand[];
  /** Timestamp performance.now() del frame. */
  timestamp: number;
}

export interface CoreEventMap {
  'stateChange': (state: CursorState) => void;
  'skeletonUpdate': (skeleton: RawSkeleton) => void;
  /** Nuovo: tutti i dati raw multi-hand ogni frame. */
  'multiHandUpdate': (frame: MultiHandFrame) => void;
  'handLost': (timeSinceLossMs: number) => void;
  'handDetected': () => void;
  'error': (err: Error) => void;
}

export interface AppManifest {
  id: string;
  title: string;
  shortDescription: string;
  interaction: {
    experienceType: 'contemplativa' | 'attiva' | 'esplorativa';
    primaryGesture: 'pointer' | 'pinch' | 'skeleton_full';
    gestureLabel: string;
  };
  presentation: {
    bubbleAssetUrl: string;
    backgroundColor: string;
    visibilityStatus: 'published' | 'draft' | 'hidden';
    sortWeight: number;
  };
  capabilities: {
    requiresVideoBackground: boolean;
    readyForRecording: boolean;
  };
}

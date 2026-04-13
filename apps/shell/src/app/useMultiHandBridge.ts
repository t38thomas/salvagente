// ── useMultiHandBridge.ts ─────────────────────────────────────
// Hook React che connette SalvagenteCore al MultiHandTracker.
//
// Responsabilità:
//   - Iscrive il tracker all'evento multiHandUpdate del core
//   - Gestisce il mouse-lock: se il mouse si muove, sospende le mani
//   - Espone `tracker` (stabile via ref) ai consumer
//   - NON usa React state ad alta frequenza
//
// Performance:
//   - Tutti i dati ad alta freq passano via tracker.subscribe()
//   - React state usato SOLO per activeHandCount (n intero, cambia poco)
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState, useCallback } from 'react';
import { SalvagenteCore } from '@salvagente/core-cv';
import { MultiHandTracker } from '@salvagente/core-cv';
import type { MultiHandFrame } from '@salvagente/shared-types';

/** Delay in ms senza movimenti mouse prima di riattivare le mani. */
const MOUSE_IDLE_TIMEOUT = 3000;

export interface MultiHandBridge {
  /** Stabile — non cambia tra render. Usare per subscribe nelle mini-app. */
  tracker: MultiHandTracker;
  /** Numero di mani attive (React state — causa re-render solo quando cambia). */
  activeHandCount: number;
}

export function useMultiHandBridge(core: SalvagenteCore | null): MultiHandBridge {
  // Il tracker è stabile per tutto il ciclo di vita del bridge
  const trackerRef = useRef<MultiHandTracker>(new MultiHandTracker());
  const tracker = trackerRef.current;

  const [activeHandCount, setActiveHandCount] = useState(0);
  const mouseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCountRef = useRef(0);

  const updateCount = useCallback(() => {
    const count = tracker.getActiveSlots().length;
    if (count !== lastCountRef.current) {
      lastCountRef.current = count;
      setActiveHandCount(count);
    }
  }, [tracker]);

  useEffect(() => {
    if (!core) return;

    // ── Collega core → tracker ────────────────────────────────
    const onMultiHand = (frame: MultiHandFrame) => {
      tracker.processFrame(frame);
      updateCount();
    };
    core.on('multiHandUpdate', onMultiHand);

    // ── Mouse-lock ────────────────────────────────────────────
    // Appena il mouse si muove → mani mute.
    // Dopo MOUSE_IDLE_TIMEOUT ms di inattività → mani riattivate.
    const onMouseMove = () => {
      if (!tracker.isMouseActive) {
        tracker.setMouseActive(true);
        updateCount();
      }
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
      mouseTimerRef.current = setTimeout(() => {
        tracker.setMouseActive(false);
      }, MOUSE_IDLE_TIMEOUT);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      core.off('multiHandUpdate', onMultiHand);
      window.removeEventListener('mousemove', onMouseMove);
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
    };
  }, [core, tracker, updateCount]);

  return { tracker, activeHandCount };
}

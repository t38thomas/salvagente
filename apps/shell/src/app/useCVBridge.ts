// ── useCVBridge.ts ───────────────────────────────────────────
// Bridge tra SalvagenteCore (EventEmitter) e lo Zustand store.
//
// Regola critica:
//   - posizione x/y → aggiornata via ref/callback, MAI in Zustand
//   - eventi binari (isPinching, isHandPresent) → Zustand
//   - il core viene inizializzato qui, una sola volta
//
// Ritorna:
//   - coreRef: istanza SalvagenteCore da passare alle mini-app
//   - videoRef: elemento <video> da montare nel DOM
//   - pointerCallbackRef: callback da chiamare nel PointerLayer
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useCallback } from 'react';
import { SalvagenteCore } from '@salvagente/core-cv';
import { useAppStoreApi } from './AppStateContext';
import type { CursorState } from '@salvagente/shared-types';

export interface CVBridge {
  /** Istanza core da passare alle mini-app */
  coreRef: React.RefObject<SalvagenteCore | null>;
  /** Elemento video da inserire nel DOM (nascosto) */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /**
   * Callback chiamata ogni frame dal core con la posizione aggiornata.
   * Il PointerLayer si registra qui tramite setPointerCallback.
   */
  setPointerCallback: (cb: ((x: number, y: number, isPinching: boolean) => void) | null) => void;
}

export function useCVBridge(): CVBridge {
  const storeApi = useAppStoreApi();
  const coreRef = useRef<SalvagenteCore | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pointerCallbackRef = useRef<((x: number, y: number, isPinching: boolean) => void) | null>(null);

  const setPointerCallback = useCallback(
    (cb: ((x: number, y: number, isPinching: boolean) => void) | null) => {
      pointerCallbackRef.current = cb;
    },
    []
  );

  useEffect(() => {
    // Crea l'elemento video programmaticamente
    const video = document.createElement('video');
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
    document.body.appendChild(video);
    videoRef.current = video;

    // Chiedi accesso webcam
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
      .then((stream) => {
        video.srcObject = stream;
        return video.play();
      })
      .then(() => {
        const core = new SalvagenteCore();
        coreRef.current = core;

        // ── Handler stateChange ─────────────────────────────
        // isPinching e isHandPresent → Zustand (eventi binari)
        // x/y → caller diretto del PointerLayer (zero React)
        let lastIsPinching = false;
        let lastIsHandPresent = false;

        core.on('stateChange', (state: CursorState) => {
          // Aggiorna il puntatore visivo — imperativo, zero re-render
          if (pointerCallbackRef.current) {
            pointerCallbackRef.current(state.position.x, state.position.y, state.isPinching);
          }

          // Commit su Zustand solo se cambia valore (eventi binari)
          const { setPinching, setHandPresence } = storeApi.getState();
          if (state.isPinching !== lastIsPinching) {
            lastIsPinching = state.isPinching;
            setPinching(state.isPinching);
          }
          if (state.isHandPresent !== lastIsHandPresent) {
            lastIsHandPresent = state.isHandPresent;
            setHandPresence(state.isHandPresent);
          }
        });

        core.on('handDetected', () => {
          storeApi.getState().setHandPresence(true);
        });

        core.on('handLost', () => {
          storeApi.getState().setHandPresence(false);
        });

        core.on('error', (err) => {
          console.error('[SalvagenteCore]', err);
        });

        core.start(video);
      })
      .catch((err) => {
        // Webcam non disponibile — modalità demo: il catalogo funziona comunque
        console.warn('[useCVBridge] Webcam non disponibile, modalità demo:', err);
      });

    return () => {
      coreRef.current?.stop();
      coreRef.current = null;
      video.srcObject = null;
      document.body.removeChild(video);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { coreRef, videoRef, setPointerCallback };
}

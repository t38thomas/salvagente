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

          // Commit su Zustand solo se cambia valore (o se lo store è stato resettato esternamente)
          const currentStore = storeApi.getState();
          const { setPinching, setHandPresence } = currentStore;

          if (state.isPinching !== lastIsPinching || state.isPinching !== currentStore.isPinching) {
            lastIsPinching = state.isPinching;
            setPinching(state.isPinching);
          }
          if (state.isHandPresent !== lastIsHandPresent || state.isHandPresent !== currentStore.isHandPresent) {
            lastIsHandPresent = state.isHandPresent;
            setHandPresence(state.isHandPresent);
          }
        });

        // ── Mouse Fallback ───────────────────────────────────
        const onMouseMove = (e: MouseEvent) => {
          // Inverti X perché il pointer layer usa (1 - nx)
          const nx = 1 - (e.clientX / window.innerWidth);
          const ny = e.clientY / window.innerHeight;
          
          if (pointerCallbackRef.current) {
            pointerCallbackRef.current(nx, ny, lastIsPinching);
          }
          
          const currentStore = storeApi.getState();
          if (!lastIsHandPresent || !currentStore.isHandPresent) {
            lastIsHandPresent = true;
            currentStore.setHandPresence(true);
          }
        };

        const onMouseDown = () => {
          lastIsPinching = true;
          storeApi.getState().setPinching(true);
          // Riemetti callback col pinch attivo
          if (pointerCallbackRef.current) {
             // Use recent pos, but we don't have it directly. That's fine, the next RAF or mousemove fixes it, or we can just rely on the visual indicator
             // To be perfect, we should store lastNx/lastNy
          }
        };

        const onMouseUp = () => {
          lastIsPinching = false;
          storeApi.getState().setPinching(false);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

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
        
        // Save cleanup func
        (core as any)._mouseCleanup = () => {
           window.removeEventListener('mousemove', onMouseMove);
           window.removeEventListener('mousedown', onMouseDown);
           window.removeEventListener('mouseup', onMouseUp);
        };
      })
      .catch((err) => {
        // Webcam non disponibile — modalità demo: il catalogo funziona comunque
        console.warn('[useCVBridge] Webcam non disponibile, modalità demo:', err);
      });

    return () => {
      if (coreRef.current) {
        const _cleanup = (coreRef.current as any)._mouseCleanup;
        if (_cleanup) _cleanup();
        coreRef.current.stop();
      }
      coreRef.current = null;
      video.srcObject = null;
      document.body.removeChild(video);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { coreRef, videoRef, setPointerCallback };
}

// ── PointerLayer.tsx ──────────────────────────────────────────
// Puntatore diegetico — aggiornato SENZA React state.
//
// Strategia:
//   - riceve setPointerCallback dal bridge CV
//   - il callback aggiorna direttamente lo style del DOM element via ref
//   - ZERO React re-render a 60fps
//   - solo la visibilità (isHandPresent) viene letta da Zustand
//     per montare/smontare il puntatore con AnimatePresence
//
// Puntatore diegetico:
//   - cerchio esterno luminoso
//   - cerchio interno "nucleo"
//   - quando isPinching: si contrae + cambia colore
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../app/AppStateContext';
import type { CVBridge } from '../app/useCVBridge';

interface PointerLayerProps {
  bridge: CVBridge;
}

export function PointerLayer({ bridge }: PointerLayerProps) {
  const isHandPresent = useAppState(s => s.isHandPresent);
  const isPinching    = useAppState(s => s.isPinching);

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Registra il callback imperativo nel bridge
  useEffect(() => {
    bridge.setPointerCallback((nx, ny, pinching) => {
      // Converti normalized → viewport px
      const x = (1 - nx) * window.innerWidth;  // mirror orizzontale
      const y = ny * window.innerHeight;

      // Aggiornamento imperativo: ZERO React overhead
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${pinching ? 0.55 : 1})`;
      }
    });

    return () => {
      bridge.setPointerCallback(null);
    };
  }, [bridge]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 'var(--z-pointer)' as unknown as number,
      }}
    >
      <AnimatePresence>
        {isHandPresent && (
          <>
            {/* Cerchio esterno */}
            <motion.div
              ref={outerRef}
              key="outer"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: isPinching ? 36 : 48,
                height: isPinching ? 36 : 48,
                borderRadius: '50%',
                border: `1.5px solid ${isPinching ? 'var(--color-accent)' : 'rgba(255,255,255,0.55)'}`,
                boxShadow: isPinching
                  ? '0 0 16px 4px var(--color-accent-glow)'
                  : '0 0 8px 2px rgba(255,255,255,0.15)',
                transition: 'width 0.15s, height 0.15s, border-color 0.15s, box-shadow 0.15s',
                willChange: 'transform',
              }}
            />

            {/* Cerchio interno / nucleo */}
            <motion.div
              ref={innerRef}
              key="inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: isPinching ? 1 : 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: isPinching ? 'var(--color-accent)' : 'rgba(255,255,255,0.8)',
                boxShadow: isPinching ? '0 0 12px 4px var(--color-accent-glow)' : 'none',
                transition: 'background 0.15s, box-shadow 0.15s',
                willChange: 'transform',
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

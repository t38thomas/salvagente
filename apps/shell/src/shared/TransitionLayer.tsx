// ── TransitionLayer.tsx ───────────────────────────────────────
// Overlay visivo per le transizioni catalogo ↔ mini-app.
// Usa un flash/veil che copre brevemente lo schermo durante il cambio.
// ─────────────────────────────────────────────────────────────
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../app/AppStateContext';

export function TransitionLayer() {
  const phase = useAppState(s => s.phase);
  const isTransitioning = phase === 'transitioning' || phase === 'returning';

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="transition-veil"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--color-void)',
            zIndex: 'var(--z-transition)' as unknown as number,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  );
}

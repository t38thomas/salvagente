// ── MiniAppHost.tsx ───────────────────────────────────────────
// Container per il mount/unmount controllato delle mini-app lazy.
//
// Contratto mini-app:
//   - riceve `core` (SalvagenteCore già avviato)
//   - riceve `onExit` callback
//   - NON deve gestire la webcam
//   - NON deve conoscere il catalogo
//   - NON deve fare routing
//
// MiniAppHost gestisce:
//   - lazy loading + Suspense
//   - animazione di ingresso/uscita
//   - sfondo per app
//   - exit button di sicurezza (fallback per eventi pubblici)
// ─────────────────────────────────────────────────────────────
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SalvagenteCore } from '@salvagente/core-cv';
import { useAppState, useAppStoreApi } from '../app/AppStateContext';
import { findRegistryEntry } from './registry';

// MiniAppProps e MiniAppComponent → importati da ./types (evita dipendenza circolare)

// ── Loading state interno ─────────────────────────────────────
function AppLoadingFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-void)',
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--color-accent-soft)',
          border: '1.5px solid var(--color-accent)',
        }}
      />
    </div>
  );
}

// ── Exit button ───────────────────────────────────────────────
function ExitButton({ onExit }: { onExit: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onExit}
      style={{
        position: 'absolute',
        top: 20,
        right: 24,
        zIndex: 500,
        background: 'rgba(12, 12, 22, 0.75)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 'var(--radius-pill)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--size-xs)',
        fontWeight: 500,
        letterSpacing: '0.08em',
        padding: '10px 18px',
        cursor: 'none',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'color 0.2s',
      }}
    >
      <span style={{ fontSize: 12 }}>←</span>
      Catalogo
    </motion.button>
  );
}

// ── Component ─────────────────────────────────────────────────
interface MiniAppHostProps {
  coreRef: React.RefObject<SalvagenteCore | null>;
}

export function MiniAppHost({ coreRef }: MiniAppHostProps) {
  const storeApi = useAppStoreApi();
  const phase = useAppState(s => s.phase);
  const activeAppId = useAppState(s => s.activeAppId);

  const entry = activeAppId ? findRegistryEntry(activeAppId) : null;
  const AppComponent = entry?.component ?? null;
  const manifest = entry?.manifest ?? null;

  const isVisible = phase === 'in-app' || phase === 'transitioning';

  const handleExit = () => {
    const store = storeApi.getState();
    store.setPhase('returning');
    store.setActiveApp(null);
    store.setFocusedBubble(null);
    store.setHoveredBubble(null);

    setTimeout(() => {
      store.resetToAttract();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isVisible && AppComponent && manifest && (
        <motion.div
          key={activeAppId}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 200,
            backgroundColor: manifest.presentation.backgroundColor ?? 'var(--color-void)',
          }}
        >
          <Suspense fallback={<AppLoadingFallback />}>
            {coreRef.current && (
              <AppComponent
                core={coreRef.current}
                onExit={handleExit}
              />
            )}
          </Suspense>

          <ExitButton onExit={handleExit} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

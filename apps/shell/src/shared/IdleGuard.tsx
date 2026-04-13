// ── IdleGuard.tsx ─────────────────────────────────────────────
// Forza il ritorno al catalogo dopo un periodo di inattività.
//
// Attivo solo quando phase === 'in-app'.
// Reset del timer ad ogni 'handDetected'.
// Tre livelli:
//   - 45s: mostra avviso visivo
//   - 60s: chiama onIdle (exit forzato)
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState, useAppStoreApi } from '../app/AppStateContext';
import type { CVBridge } from '../app/useCVBridge';

const WARN_AFTER_MS = 45_000;  // 45s → avviso
const EXIT_AFTER_MS = 60_000;  // 60s → uscita automatica

interface IdleGuardProps {
  bridge: CVBridge;
}

export function IdleGuard({ bridge }: IdleGuardProps) {
  const phase    = useAppState(s => s.phase);
  const storeApi = useAppStoreApi();

  const [showWarning, setShowWarning] = useState(false);
  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimers = () => {
    setShowWarning(false);
    if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    warnTimerRef.current = setTimeout(() => {
      setShowWarning(true);
    }, WARN_AFTER_MS);

    exitTimerRef.current = setTimeout(() => {
      const store = storeApi.getState();
      store.setPhase('returning');
      store.setActiveApp(null);
      setTimeout(() => store.resetToAttract(), 500);
    }, EXIT_AFTER_MS);
  };

  const clearTimers = () => {
    setShowWarning(false);
    if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
  };

  // Avvia/ferma i timer in base alla fase
  useEffect(() => {
    if (phase === 'in-app') {
      resetTimers();
    } else {
      clearTimers();
    }
    return clearTimers;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Reset del timer ad ogni handDetected
  useEffect(() => {
    if (phase !== 'in-app') return;

    const handleHandDetected = () => resetTimers();
    bridge.coreRef.current?.on('handDetected', handleHandDetected);

    return () => {
      bridge.coreRef.current?.off('handDetected', handleHandDetected);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, bridge.coreRef.current]);

  return (
    <AnimatePresence>
      {showWarning && phase === 'in-app' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 600,
            background: 'rgba(12, 12, 22, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(123,97,255,0.3)',
            borderRadius: 'var(--radius-pill)',
            padding: '12px 24px',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--size-sm)',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: 16 }}>✋</span>
          Mostra la mano per continuare…
        </motion.div>
      )}
    </AnimatePresence>
  );
}

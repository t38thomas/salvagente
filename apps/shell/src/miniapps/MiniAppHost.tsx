// ── MiniAppHost.tsx ───────────────────────────────────────────
// Container per il mount/unmount controllato delle mini-app lazy.
//
// Contratto mini-app:
//   - riceve `core` (SalvagenteCore già avviato)
//   - riceve `onExit` callback
//   - riceve `tracker` + `activeHandCount` (multi-hand bridge)
//   - NON deve gestire la webcam
//   - NON deve conoscere il catalogo
//   - NON deve fare routing
//
// MiniAppHost gestisce:
//   - lazy loading + Suspense
//   - animazione di ingresso/uscita
//   - sfondo per app
//   - exit button di sicurezza (fallback per eventi pubblici)
//   - inizializzazione MultiHandBridge (una volta sola per session)
// ─────────────────────────────────────────────────────────────
import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SalvagenteCore } from '@salvagente/core-cv';
import { useAppState, useAppStoreApi } from '../app/AppStateContext';
import { useMultiHandBridge } from '../app/useMultiHandBridge';
import { findRegistryEntry } from './registry';

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
function ExitButton({ onExit, pointerPosRef }: { onExit: () => void; pointerPosRef: React.RefObject<{ x: number; y: number }> }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [confirmProgress, setConfirmProgress] = useState(0);

  const hoverRef = useRef(false);
  const pinchStartRef = useRef<number | null>(null);
  const pinchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const animRafRef = useRef<number | null>(null);

  // RAF loop per hit-test del bottone
  const hitboxLoop = useCallback(() => {
    const pos = pointerPosRef.current;
    if (!pos || !buttonRef.current) {
      rafRef.current = requestAnimationFrame(hitboxLoop);
      return;
    }

    const { x: nx, y: ny } = pos;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const px = (1 - nx) * W;
    const py = ny * H;

    const rect = buttonRef.current.getBoundingClientRect();
    const margin = 40; // hitbox generosa
    const hit = px >= rect.left - margin && px <= rect.right + margin &&
      py >= rect.top - margin && py <= rect.bottom + margin;

    if (hit !== hoverRef.current) {
      hoverRef.current = hit;
      setIsHovered(hit);
    }

    rafRef.current = requestAnimationFrame(hitboxLoop);
  }, [pointerPosRef]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(hitboxLoop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hitboxLoop]);

  // Hover-to-confirm (2s)
  useEffect(() => {
    if (isHovered) {
      pinchStartRef.current = performance.now();
      setConfirmProgress(0);

      const animateProgress = () => {
        const elapsed = performance.now() - (pinchStartRef.current ?? 0);
        const progress = Math.min(elapsed / 2000, 1);
        setConfirmProgress(progress);
        if (progress < 1) {
          animRafRef.current = requestAnimationFrame(animateProgress);
        }
      };
      animRafRef.current = requestAnimationFrame(animateProgress);

      pinchTimerRef.current = setTimeout(() => {
        onExit();
      }, 2000);
    } else {
      if (pinchTimerRef.current) {
        clearTimeout(pinchTimerRef.current);
        pinchTimerRef.current = null;
      }
      setConfirmProgress(0);
    }
    return () => {
      if (pinchTimerRef.current) clearTimeout(pinchTimerRef.current);
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
    };
  }, [isHovered, onExit]);

  return (
    <motion.button
      ref={buttonRef}
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
        background: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'rgba(12, 12, 22, 0.75)',
        border: `1px solid ${isHovered ? 'var(--color-accent)' : 'rgba(255,255,255,0.12)'}`,
        boxShadow: isHovered ? '0 0 16px var(--color-accent-glow)' : 'none',
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
        transition: 'color 0.2s, background-color 0.2s, box-shadow 0.2s, border-color 0.2s',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: 'var(--color-accent)',
          opacity: 0.3,
          transformOrigin: 'left',
          transform: `scaleX(${confirmProgress})`,
          transition: confirmProgress === 0 ? 'transform 0.2s' : 'none'
        }}
      />
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12 }}>←</span>
        Catalogo
      </span>
    </motion.button>
  );
}

// ── Component ─────────────────────────────────────────────────
interface MiniAppHostProps {
  coreRef: React.RefObject<SalvagenteCore | null>;
  pointerPosRef: React.RefObject<{ x: number; y: number }>;
}

export function MiniAppHost({ coreRef, pointerPosRef }: MiniAppHostProps) {
  const storeApi = useAppStoreApi();
  const phase = useAppState(s => s.phase);
  const activeAppId = useAppState(s => s.activeAppId);

  // Bridge multi-hand — inizializzato una sola volta per l'intera sessione
  const { tracker, activeHandCount } = useMultiHandBridge(coreRef.current);

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
                tracker={tracker}
                activeHandCount={activeHandCount}
              />
            )}
          </Suspense>

          <ExitButton onExit={handleExit} pointerPosRef={pointerPosRef} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

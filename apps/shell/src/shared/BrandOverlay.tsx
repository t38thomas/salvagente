// ── BrandOverlay.tsx ──────────────────────────────────────────
// Branding Salvagente (protagonista) + Naqah (istituzionale).
//
// Gerarchia:
//   - Salvagente: nome in alto sinistra, grande, prominente
//   - Naqah: badge in basso destra, piccolo, discreto
//
// Comportamento:
//   - In fase attract: piena visibilità
//   - In fase browsing/hovered/focused: ridotta visibilità
//   - In fase in-app: completamente nascosto
// ─────────────────────────────────────────────────────────────
import { motion } from 'framer-motion';
import { useAppState } from '../app/AppStateContext';

const PHASE_OPACITY: Record<string, number> = {
  attract:      1,
  browsing:     0.45,
  hovered:      0.35,
  focused:      0.25,
  confirming:   0.15,
  transitioning:0,
  'in-app':     0,
  returning:    0,
};

export function BrandOverlay() {
  const phase = useAppState(s => s.phase);
  const opacity = PHASE_OPACITY[phase] ?? 0;

  return (
    <motion.div
      animate={{ opacity }}
      transition={{ duration: 0.6, ease: [0.45, 0, 0.55, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 'var(--z-brand)' as unknown as number,
      }}
    >
      {/* ── Salvagente — Top Left ── */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--size-xl)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1,
            margin: 0,
          }}
        >
          Salvagente
        </h1>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--size-xs)',
            fontWeight: 300,
            letterSpacing: '0.12em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
          }}
        >
          esperienze gestuali interattive
        </span>
      </div>

      {/* ── Microcopy attract — Centro ── */}
      <motion.div
        animate={{ opacity: phase === 'attract' ? 0.55 : 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '14%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--sp-3)',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            animation: 'pulse-glow 2.4s ease-in-out infinite',
          }}
        >
          ✋
        </div>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--size-sm)',
            fontWeight: 300,
            letterSpacing: '0.08em',
            color: 'var(--text-tertiary)',
            margin: 0,
          }}
        >
          Mostra la mano per navigare
        </p>
      </motion.div>

      {/* ── Naqah — Bottom Right ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--size-xs)',
            fontWeight: 300,
            letterSpacing: '0.08em',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
          }}
        >
          un progetto
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--size-sm)',
            fontWeight: 500,
            letterSpacing: '0.06em',
            color: 'var(--color-gold)',
          }}
        >
          Naqah
        </span>
      </div>
    </motion.div>
  );
}

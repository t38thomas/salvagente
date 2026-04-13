// ── BubbleOverlay.tsx ────────────────────────────────────────
// Overlay informativo che appare quando una bolla è focused.
// Mostra: nome, descrizione, tipo esperienza, gesto, loader radiale.
// Posizionato adiacente alla bolla, non al centro schermo.
// ─────────────────────────────────────────────────────────────
import { motion, AnimatePresence } from 'framer-motion';
import type { AppManifest } from '@salvagente/shared-types';
import type { BubbleLayout } from './types';

const PINCH_DURATION_MS = 500; // Deve corrispondere al --pinch-duration CSS token

interface BubbleOverlayProps {
  manifest: AppManifest | null;
  layout: BubbleLayout | null;
  isVisible: boolean;
  isConfirming: boolean;
  confirmProgress: number; // 0→1
}

// ── Badge tipo esperienza ─────────────────────────────────────
const TYPE_COLORS: Record<string, string> = {
  contemplativa: '#7b61ff',
  attiva: '#c86494',
  esplorativa: '#3ab4c8',
};

const TYPE_LABELS: Record<string, string> = {
  contemplativa: 'contemplativa',
  attiva: 'attiva',
  esplorativa: 'esplorativa',
};

// ── Loader radiale SVG ────────────────────────────────────────
function PinchLoader({ progress }: { progress: number }) {
  const R = 22;
  const circ = 2 * Math.PI * R;
  const dash = circ * progress;

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" style={{ display: 'block' }}>
      {/* Traccia di sfondo */}
      <circle
        cx="28" cy="28" r={R}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="3"
      />
      {/* Arco di progresso */}
      <circle
        cx="28" cy="28" r={R}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 28 28)"
        style={{ transition: `stroke-dasharray ${PINCH_DURATION_MS}ms linear` }}
      />
      {/* Icona centrale */}
      <text
        x="28" y="33"
        textAnchor="middle"
        fontSize="14"
        fill="rgba(255,255,255,0.8)"
      >
        ✦
      </text>
    </svg>
  );
}

// ── Posizionamento overlay ────────────────────────────────────
// L'overlay appare a destra della bolla se cx < 60%, altrimenti a sinistra.
function getOverlayPosition(layout: BubbleLayout): React.CSSProperties {
  const side = layout.cx < 58 ? 'right' : 'left';
  const offset = side === 'right'
    ? { left: `calc(${layout.cx}% + var(${layout.sizeVar}) * 0.52 + 16px)` }
    : { right: `calc(${100 - layout.cx}% + var(${layout.sizeVar}) * 0.52 + 16px)` };

  return {
    position: 'absolute',
    top: `${layout.cy}%`,
    transform: 'translateY(-50%)',
    ...offset,
    zIndex: 150,
    maxWidth: 'clamp(200px, 22vw, 300px)',
    pointerEvents: 'none',
  };
}

// ── Component ─────────────────────────────────────────────────
export function BubbleOverlay({ manifest, layout, isVisible, isConfirming, confirmProgress }: BubbleOverlayProps) {
  if (!manifest || !layout) return null;

  const typeColor = TYPE_COLORS[manifest.interaction.experienceType] ?? '#7b61ff';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={manifest.id}
          initial={{ opacity: 0, x: layout.cx < 58 ? -12 : 12, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: layout.cx < 58 ? -8 : 8, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={getOverlayPosition(layout)}
        >
          <div
            style={{
              background: 'rgba(12, 12, 22, 0.82)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(123,97,255,0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--sp-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-3)',
            }}
          >
            {/* Badge tipo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: typeColor,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--size-xs)',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: typeColor,
                }}
              >
                {TYPE_LABELS[manifest.interaction.experienceType]}
              </span>
            </div>

            {/* Titolo */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--size-lg)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {manifest.title}
            </h2>

            {/* Descrizione */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--size-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              {manifest.shortDescription}
            </p>

            {/* Gesto richiesto */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
                marginTop: 'var(--sp-1)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: 'var(--sp-3)',
              }}
            >
              {/* Loader o icona */}
              {isConfirming ? (
                <PinchLoader progress={confirmProgress} />
              ) : (
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  🤏
                </div>
              )}
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--size-xs)',
                  color: isConfirming ? 'var(--color-accent)' : 'var(--text-secondary)',
                  lineHeight: 1.4,
                  transition: 'color 0.2s ease',
                }}
              >
                {isConfirming
                  ? 'Tieni il pinch…'
                  : manifest.interaction.gestureLabel || 'Tieni il pinch per entrare'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

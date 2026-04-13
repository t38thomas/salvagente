// ── BubbleItem.tsx ───────────────────────────────────────────
// Singola bolla del catalogo.
// Framer Motion gestisce le transizioni di stato (focus, hover, attenuation).
// Il drift è puramente CSS per non appesantire il JS thread.
// ─────────────────────────────────────────────────────────────
import { motion } from 'framer-motion';
import type { BubbleProps } from './types';

// ── Varianti Framer Motion ────────────────────────────────────
const bubbleVariants = {
  idle: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px) brightness(1)',
  },
  hovered: {
    scale: 1.06,
    opacity: 1,
    filter: 'blur(0px) brightness(1.15)',
  },
  focused: {
    scale: 1.14,
    opacity: 1,
    filter: 'blur(0px) brightness(1.3)',
  },
  attenuated: {
    scale: 0.94,
    opacity: 0.45,
    filter: 'blur(2px) brightness(0.7)',
  },
};

function getVariant(props: BubbleProps): string {
  if (props.isFocused) return 'focused';
  if (props.isHovered) return 'hovered';
  if (props.isOtherFocused) return 'attenuated';
  return 'idle';
}

export function BubbleItem({ manifest, layout, isHovered, isFocused, isOtherFocused }: BubbleProps) {
  const variant = getVariant({ manifest, layout, isHovered, isFocused, isOtherFocused });

  const driftAnimation = {
    animationName: `drift-${layout.driftVariant}`,
    animationDuration: `${layout.driftDuration}s`,
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationDelay: `${layout.driftDelay}s`,
    // Sospendi il drift quando la bolla è in focus
    animationPlayState: isFocused ? 'paused' : 'running',
  };

  // Colore base per layer
  const bgColor =
    layout.layer === 0
      ? 'var(--bubble-layer0)'
      : layout.layer === 1
        ? 'var(--bubble-layer1)'
        : 'var(--bubble-layer2)';

  const glowIntensity = isFocused ? '0 0 60px 20px var(--bubble-glow-color)' : isHovered ? '0 0 30px 8px var(--bubble-glow-color)' : 'none';

  return (
    // 1. Wrapper posizionamento: Absolute + Centratura fissa -50%
    <div
      style={{
        position: 'absolute',
        left: `${layout.cx}%`,
        top: `${layout.cy}%`,
        transform: 'translate(-50%, -50%)',
        width: `var(${layout.sizeVar})`,
        height: `var(${layout.sizeVar})`,
        zIndex: (layout.layer + 1) * 10,
      }}
    >
      {/* 2. Wrapper drift: Usa CSS animation (che setta un suo transform: translate) */}
      <div style={{ width: '100%', height: '100%', ...driftAnimation }}>
        {/* 3. Wrapper Framer Motion: Gestisce scale e opacità (che usa un altro transform) */}
        <motion.div
          data-bubble-id={manifest.id}
          data-bubble-cx={layout.cx}
          data-bubble-cy={layout.cy}
          variants={bubbleVariants}
          animate={variant}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Corpo della bolla */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle at 38% 32%, ${bgColor.replace(')', ', 0.6)').replace('rgba', 'rgba')}, ${bgColor})`,
          backgroundColor: bgColor,
          boxShadow: glowIntensity,
          border: isFocused
            ? '1.5px solid rgba(123,97,255,0.6)'
            : '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexDirection: 'column',
          gap: '4px',
          padding: '16px',
        }}
      >
        {/* Interno: nome bolla — visibile solo in idle/hovered */}
        {!isFocused && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 0.9 : 0.55 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--size-xs)',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              textAlign: 'center',
              lineHeight: 1.2,
              pointerEvents: 'none',
            }}
          >
            {manifest.title}
          </motion.span>
        )}

        {/* Specchio highlight interno */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '18%',
            width: '28%',
            height: '18%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>
        </motion.div>
      </div>
    </div>
  );
}

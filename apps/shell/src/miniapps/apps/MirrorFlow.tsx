// ── MirrorFlow.tsx ────────────────────────────────────────────
// Mini-app multi-hand: traccia SOLO il dito indice (landmark 8)
// di ogni mano con trail colorati per slot.
//
// Comportamento multi-hand:
//   - Fino a 8 trail simultanei, uno per slot attivo
//   - Ogni slot ha un colore fisso dalla HAND_SLOT_COLORS palette
//   - Quando il mouse è attivo, tutti i trail si fermano
//   - Graceful degradation: se una mano sparisce, il trail sfuma e basta
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import type { MultiHandMiniAppProps } from '../types';
import type { HandSlot } from '@salvagente/shared-types';
import { HAND_SLOT_COLORS } from '@salvagente/core-cv';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

const MAX_TRAIL = 90;
const MAX_HANDS = 8;

// Una trail per slot
type TrailMap = TrailPoint[][];

export default function MirrorFlow({ tracker }: MultiHandMiniAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailsRef = useRef<TrailMap>(Array.from({ length: MAX_HANDS }, () => []));
  const rafRef    = useRef<number | null>(null);
  // Snapshot degli slot ricevuto via subscribe (aggiornato fuori dal render loop)
  const slotsRef  = useRef<readonly HandSlot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Subscribe al tracker (zero React state, zero re-render) ──
    const unsubscribe = tracker.subscribe(slots => {
      slotsRef.current = slots;
    });

    // ── Render loop ───────────────────────────────────────────
    const render = () => {
      const W = canvas.width;
      const H = canvas.height;

      // Fade sfondo
      ctx.fillStyle = 'rgba(7, 5, 18, 0.18)';
      ctx.fillRect(0, 0, W, H);

      const slots = slotsRef.current;

      // Aggiorna trail per ogni slot
      for (let i = 0; i < MAX_HANDS; i++) {
        const slot = slots[i];
        const trail = trailsRef.current[i];

        if (slot?.active) {
          // Landmark 8 = indice tip, mirrorato orizzontalmente
          const lm = slot.landmarks[8];
          if (lm) {
            trail.push({ x: (1 - lm.x) * W, y: lm.y * H, age: 0 });
            if (trail.length > MAX_TRAIL) trail.shift();
          }
        }

        // Aggiorna età di tutti i punti (anche delle trail di mani sparite)
        for (const p of trail) p.age++;
        // Rimuovi punti troppo vecchi
        while (trail.length > 0 && trail[0].age > MAX_TRAIL) trail.shift();

        if (trail.length < 2) continue;

        // Disegna trail
        const color = HAND_SLOT_COLORS[i] ?? '#ffffff';
        for (let j = 1; j < trail.length; j++) {
          const p    = trail[j];
          const prev = trail[j - 1];
          const lifeFactor = 1 - p.age / MAX_TRAIL;
          const thickness  = lifeFactor * 5 + 1;

          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = hexToRgba(color, lifeFactor * 0.88);
          ctx.lineWidth   = thickness;
          ctx.lineCap     = 'round';
          ctx.lineJoin    = 'round';
          ctx.stroke();
        }

        // Particella di punta (solo se lo slot è ancora attivo)
        if (slot?.active && trail.length > 0) {
          const tip = trail[trail.length - 1];
          const lifeFactor = 1 - tip.age / MAX_TRAIL;
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(color, 0.9 * lifeFactor);
          ctx.shadowBlur  = 18;
          ctx.shadowColor = hexToRgba(color, 0.5 * lifeFactor);
          ctx.fill();
          ctx.shadowBlur  = 0;
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      unsubscribe();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [tracker]);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#070512' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      />

      {/* Titolo discreto */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 32,
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--size-sm)',
          fontWeight: 300,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        Mirror Flow
      </div>
    </div>
  );
}

// ── util ─────────────────────────────────────────────────────
/** Converte hex #RRGGBB in rgba(r,g,b,a) */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

// ── ShadowPuppets.tsx ─────────────────────────────────────────
// Mini-app multi-hand: proietta lo scheletro completo di ogni mano
// con un colore diverso per slot (fino a 8 mani simultanee).
//
// Comportamento multi-hand:
//   - Ogni slot attivo viene disegnato in overlay con il suo colore
//   - Quando il mouse è attivo, nessuno scheletro è visibile
//   - Graceful degradation: se una mano sparisce, il suo skeleton scompare
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import type { MultiHandMiniAppProps } from '../types';
import type { HandSlot } from '@salvagente/shared-types';
import { HAND_SLOT_COLORS } from '@salvagente/core-cv';

// Connessioni tra landmark della mano (MediaPipe schema)
const CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
];

export default function ShadowPuppets({ tracker }: MultiHandMiniAppProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const slotsRef   = useRef<readonly HandSlot[]>([]);
  const rafRef     = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Subscribe al tracker ──────────────────────────────────
    const unsubscribe = tracker.subscribe(slots => {
      slotsRef.current = slots;
    });

    // ── Render loop ───────────────────────────────────────────
    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Sfondo
      ctx.fillStyle = '#080e0c';
      ctx.fillRect(0, 0, W, H);

      const slots = slotsRef.current;
      const activeSlots = slots.filter(s => s.active);

      if (activeSlots.length === 0) {
        // Placeholder quando nessuna mano
        ctx.fillStyle = 'rgba(58,180,200,0.06)';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.font = `300 clamp(14px,1.4vw,18px) 'DM Sans', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('Mostra la mano alla webcam', W / 2, H / 2);
      } else {
        // ── Disegna ogni slot ──────────────────────────────────
        for (const slot of activeSlots) {
          if (!slot.landmarks || slot.landmarks.length < 21) continue;

          const color   = HAND_SLOT_COLORS[slot.slotIndex] ?? '#ffffff';
          const isPinch = slot.isPinching;

          // Landmark → pixel (con mirror orizzontale)
          const pts = slot.landmarks.map(lm => ({
            x: (1 - lm.x) * W,
            y: lm.y * H,
          }));

          // Ombra calda per ogni mano
          ctx.shadowBlur  = 50;
          ctx.shadowColor = hexToRgba(color, isPinch ? 0.5 : 0.25);

          // Connessioni
          ctx.strokeStyle  = color;
          ctx.lineWidth    = isPinch ? 4 : 2.5;
          ctx.lineCap      = 'round';
          ctx.globalAlpha  = 0.82;

          for (const [a, b] of CONNECTIONS) {
            const pa = pts[a];
            const pb = pts[b];
            if (!pa || !pb) continue;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
          }

          // Nodi landmark
          ctx.globalAlpha = 1;
          ctx.shadowBlur  = 8;
          for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            if (!p) continue;
            // Polpastrelli più grandi (4=pollice, 8=indice, 12=medio, 16=anulare, 20=mignolo)
            const isTip = i === 4 || i === 8 || i === 12 || i === 16 || i === 20;
            const isWrist = i === 0;
            const r = isWrist ? 8 : isTip ? 6 : 3.5;

            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = isTip ? '#ffffff' : color;
            ctx.fill();
          }

          ctx.shadowBlur  = 0;
          ctx.globalAlpha = 1;
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
    <div style={{ position: 'absolute', inset: 0 }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 32,
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--size-sm)',
          fontWeight: 300,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.25)',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        Shadow Puppets
      </div>
    </div>
  );
}

// ── util ─────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

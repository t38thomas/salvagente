// ── MirrorFlow.tsx ────────────────────────────────────────────
// Mini-app demo — esperienza contemplativa.
// Traccia i landmark della mano e disegna un trail fluido su canvas.
//
// Contratto rispettato:
//   - riceve `core` già avviato
//   - riceve `onExit`
//   - NON gestisce la webcam
//   - NON conosce il catalogo
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import type { MiniAppProps } from '../types';
import type { CursorState } from '@salvagente/shared-types';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  hue: number;
}

const MAX_TRAIL = 80;

export default function MirrorFlow({ core }: MiniAppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef  = useRef<TrailPoint[]>([]);
  const hueRef    = useRef(260);
  const rafRef    = useRef<number | null>(null);

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

    // Ascolta i movimenti della mano
    const onState = (state: CursorState) => {
      if (!state.isHandPresent) return;
      const W = canvas.width;
      const H = canvas.height;
      hueRef.current = (hueRef.current + 0.5) % 360;
      trailRef.current.push({
        x: (1 - state.position.x) * W, // specchio orizzontale
        y: state.position.y * H,
        age: 0,
        hue: hueRef.current,
      });
      if (trailRef.current.length > MAX_TRAIL) {
        trailRef.current.shift();
      }
    };

    core.on('stateChange', onState);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fade sfondo
      ctx.fillStyle = 'rgba(8, 6, 18, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const trail = trailRef.current;

      // Aggiorna età
      for (const p of trail) p.age++;

      // Disegna trail
      for (let i = 1; i < trail.length; i++) {
        const p = trail[i];
        const prev = trail[i - 1];
        const lifeFactor = 1 - p.age / MAX_TRAIL;
        const thickness = lifeFactor * 6 + 1;

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${p.hue}, 85%, 72%, ${lifeFactor * 0.85})`;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Particella punta
      if (trail.length > 0) {
        const tip = trail[trail.length - 1];
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${tip.hue}, 95%, 88%, 0.9)`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${tip.hue}, 95%, 78%, 0.6)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      core.off('stateChange', onState);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [core]);

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

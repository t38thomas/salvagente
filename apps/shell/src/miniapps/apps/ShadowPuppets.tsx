// ── ShadowPuppets.tsx ─────────────────────────────────────────
// Mini-app demo — esperienza esplorativa.
// Proietta una silhouette della mano con ombre dinamiche.
//
// Usa skeletonUpdate per disegnare i landmark completi della mano.
// ─────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import type { MiniAppProps } from '../types';
import type { RawSkeleton, CursorState } from '@salvagente/shared-types';

// Connessioni tra landmark della mano (MediaPipe schema)
const CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
];

export default function ShadowPuppets({ core }: MiniAppProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const skeletonRef  = useRef<RawSkeleton | null>(null);
  const isPinchRef   = useRef(false);
  const rafRef       = useRef<number | null>(null);

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

    const onSkeleton = (sk: RawSkeleton) => { skeletonRef.current = sk; };
    const onState    = (s: CursorState)  => { isPinchRef.current = s.isPinching; };

    core.on('skeletonUpdate', onSkeleton);
    core.on('stateChange', onState);

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Sfondo
      ctx.fillStyle = '#080e0c';
      ctx.fillRect(0, 0, W, H);

      const sk = skeletonRef.current;
      if (sk) {
        const pts = sk.landmarks.map(lm => ({
          x: (1 - lm.x) * W, // mirror
          y: lm.y * H,
        }));

        const isPinch = isPinchRef.current;
        const baseColor = isPinch ? '#a8f0c8' : '#3ab4c8';

        // Ombra proiettata
        ctx.shadowBlur   = 60;
        ctx.shadowColor  = isPinch ? 'rgba(168,240,200,0.4)' : 'rgba(58,180,200,0.3)';

        // Connessioni
        ctx.strokeStyle = baseColor;
        ctx.lineWidth   = isPinch ? 4 : 2.5;
        ctx.lineCap     = 'round';
        ctx.globalAlpha = 0.85;

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
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          if (!p) continue;
          const r = i === 0 ? 9 : i === 4 || i === 8 ? 7 : 4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = i === 4 || i === 8 ? '#ffffff' : baseColor;
          ctx.fill();
        }

        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;
      } else {
        // Placeholder quando nessuna mano
        ctx.fillStyle = 'rgba(58,180,200,0.08)';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = `300 clamp(14px,1.4vw,18px) 'DM Sans', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('Mostra la mano alla webcam', W / 2, H / 2);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      core.off('skeletonUpdate', onSkeleton);
      core.off('stateChange', onState);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [core]);

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

// ── App.tsx — AppShell root ───────────────────────────────────
// Entry point dell'intera shell Salvagente.
// Composizione dei layer:
//
//   field(0) → bubbles(10-30) → overlay(100) →
//   miniapp(200) → pointer(200) → brand(300) → transition(400)
// ─────────────────────────────────────────────────────────────
import { useRef } from 'react';
import './styles/global.css';
import { AppStateProvider } from './app/AppStateContext';
import { useCVBridge } from './app/useCVBridge';
import { BubbleCatalog } from './catalog/BubbleCatalog';
import { MiniAppHost } from './miniapps/MiniAppHost';
import { PointerLayer } from './shared/PointerLayer';
import { BrandOverlay } from './shared/BrandOverlay';
import { IdleGuard } from './shared/IdleGuard';
import { TransitionLayer } from './shared/TransitionLayer';

// ── Inner shell — ha accesso al context ──────────────────────
function ShellInner() {
  /**
   * Ref di posizione puntatore normalizzata (0–1).
   * Aggiornato dal CVBridge a 60fps senza passare per React state.
   * Letto dal BubbleField.tsx nel suo RAF loop hitbox.
   */
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Bridge CV: gestisce webcam + core-cv
  const bridge = useCVBridge();

  /**
   * Registriamo UN unico callback nel bridge.
   * Questo callback aggiorna:
   *   1. pointerPosRef → letto da BubbleField (RAF hitbox, zero React)
   *   2. Viene passato a PointerLayer → aggiorna il DOM imperativo
   *
   * PointerLayer registra il propro callback tramite bridge.setPointerCallback.
   * Noi qui intercettiamo quella registrazione per fare il double-write.
   */
  const pointerLayerCbRef = useRef<((x: number, y: number, p: boolean) => void) | null>(null);

  // Intercept: quando PointerLayer chiama setPointerCallback,
  // noi salviamo il suo callback e registriamo invece il nostro aggregato
  const setPointerCallback = useRef((cb: ((x: number, y: number, p: boolean) => void) | null) => {
    pointerLayerCbRef.current = cb;
    // Registra il nostro aggregatore nel bridge
    bridge.setPointerCallback(cb
      ? (x, y, p) => {
        pointerPosRef.current = { x, y };
        pointerLayerCbRef.current?.(x, y, p);
      }
      : null
    );
  });

  // Esponi il wrapper come bridge corretto verso PointerLayer
  const bridgeForPointer = {
    ...bridge,
    setPointerCallback: setPointerCallback.current,
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-void)',
      }}
    >
      {/* ── Root experience: catalogo bolle ── */}
      <BubbleCatalog pointerPosRef={pointerPosRef} />

      {/* ── Mini-app lazy mount ── */}
      <MiniAppHost coreRef={bridge.coreRef} pointerPosRef={pointerPosRef} />

      {/* ── Puntatore diegetico (zero re-render a 60fps) ── */}
      <PointerLayer bridge={bridgeForPointer} />

      {/* ── Branding Salvagente / Naqah ── */}
      <BrandOverlay />

      {/* ── Idle timeout per evento pubblico ── */}
      <IdleGuard bridge={bridge} />

      {/* ── Veil di transizione inter-state ── */}
      <TransitionLayer />
    </div>
  );
}

// ── Root con Provider ─────────────────────────────────────────
export default function App() {
  return (
    <AppStateProvider>
      <ShellInner />
    </AppStateProvider>
  );
}

// ── BubbleField.tsx ──────────────────────────────────────────
// Campo delle bolle 2.5D con RAF-based hitbox detection.
//
// Architettura critica:
//   - Il loop RAF gira completamente fuori da React
//   - Legge la posizione puntatore da un ref aggiornato dal PointerLayer
//   - Commit su Zustand SOLO quando cambia hoveredBubbleId o focusedBubbleId
//   - Isteresi: un candidato deve essere stabile per FOCUS_STABILIZE_MS
//     prima di diventare focusedBubbleId
//   - Pinch-to-confirm: setTimeout 500ms, cancel se pinch termina prima
//
// Render:
//   - BubbleItem per ogni bolla visibile
//   - BubbleOverlay per la bolla focused
// ─────────────────────────────────────────────────────────────
import {
  useEffect, useRef, useCallback, useState,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import type { AppManifest } from '@salvagente/shared-types';
import type { BubbleLayout } from './types';
import { BubbleItem } from './BubbleItem';
import { BubbleOverlay } from './BubbleOverlay';
import { useAppState, useAppStoreApi } from '../app/AppStateContext';

// ── Tunables ──────────────────────────────────────────────────
const HOVER_RADIUS_VH = 14;   // % vh — raggio hitbox bolla (tollerante)
const FOCUS_STABILIZE_MS = 280; // ms prima che hovered → focused
const PINCH_CONFIRM_MS = 500; // ms pinch per conferma

interface BubbleFieldProps {
  manifests: AppManifest[];
  layouts: BubbleLayout[];
  /** Ref al punto x/y puntatore — aggiornato dal PointerLayer senza React */
  pointerPosRef: React.RefObject<{ x: number; y: number }>;
  onAppOpen: (appId: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────
function getBubbleCenterPx(layout: BubbleLayout): { cx: number; cy: number } {
  const { innerWidth: W, innerHeight: H } = window;
  return { cx: (layout.cx / 100) * W, cy: (layout.cy / 100) * H };
}

function getBubbleRadiusPx(layout: BubbleLayout): number {
  // Raggio = metà della dimensione CSS della bolla + generosità
  const { innerHeight: H } = window;
  const baseVh = layout.layer === 0 ? 6.5 : layout.layer === 1 ? 8.5 : 10.5;
  return (baseVh / 100) * H + (HOVER_RADIUS_VH / 100) * H * 0.4;
}

// ── Component ─────────────────────────────────────────────────
export function BubbleField({ manifests, layouts, pointerPosRef, onAppOpen }: BubbleFieldProps) {
  const storeApi = useAppStoreApi();
  const phase = useAppState(s => s.phase);
  const hoveredId = useAppState(s => s.hoveredBubbleId);
  const focusedId = useAppState(s => s.focusedBubbleId);
  const isPinching = useAppState(s => s.isPinching);

  // Debug mode visiva
  const [isDebug] = useState(() => new URLSearchParams(window.location.search).has('debug'));

  // ── Stato locale pinch-to-confirm ────────────────────────────
  const [confirmProgress, setConfirmProgress] = useState(0);
  const pinchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinchStartRef = useRef<number | null>(null);
  const pinchAnimFrameRef = useRef<number | null>(null);

  // Ref inter-frame per RAF hitbox loop
  const candidateRef = useRef<string | null>(null);
  const candidateSinceRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // ── RAF hitbox loop ───────────────────────────────────────────
  const hitboxLoop = useCallback(() => {
    const pos = pointerPosRef.current;
    if (!pos) { rafRef.current = requestAnimationFrame(hitboxLoop); return; }

    const { x: nx, y: ny } = pos; // normalizzato 0–1
    const W = window.innerWidth;
    const H = window.innerHeight;
    // FIX MAPPING: Applichiamo il mirror orizzontale per far combaciare
    // le coordinate normalizzate MediaPipe con il viewport,
    // esattamente come fa il PointerLayer
    const px = (1 - nx) * W;
    const py = ny * H;

    let closestId: string | null = null;
    let closestDist = Infinity;

    for (const layout of layouts) {
      const { cx, cy } = getBubbleCenterPx(layout);
      const radius = getBubbleRadiusPx(layout);
      const dist = Math.hypot(px - cx, py - cy);
      if (dist < radius && dist < closestDist) {
        closestDist = dist;
        closestId = layout.id;
      }
    }

    // Aggiorna hovered nel store (commit solo se cambia)
    const store = storeApi.getState();
    if (closestId !== store.hoveredBubbleId) {
      store.setHoveredBubble(closestId);
    }

    // Isteresi: il candidato deve restare stabile per FOCUS_STABILIZE_MS
    const now = performance.now();
    if (closestId !== candidateRef.current) {
      candidateRef.current = closestId;
      candidateSinceRef.current = now;
    } else if (
      closestId !== null &&
      closestId !== store.focusedBubbleId &&
      now - candidateSinceRef.current >= FOCUS_STABILIZE_MS
    ) {
      store.setFocusedBubble(closestId);
    } else if (closestId === null && store.focusedBubbleId !== null) {
      store.setFocusedBubble(null);
    }

    rafRef.current = requestAnimationFrame(hitboxLoop);
  }, [layouts, pointerPosRef, storeApi]);

  // Avvia/ferma il loop quando la fase lo richiede
  useEffect(() => {
    const activePhases = ['browsing', 'hovered', 'focused', 'attract'];
    if (activePhases.includes(phase)) {
      rafRef.current = requestAnimationFrame(hitboxLoop);
    }
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, hitboxLoop]);

  // ── Pinch-to-confirm ──────────────────────────────────────────
  useEffect(() => {
    if (isPinching && focusedId) {
      // Avvia il timer e l'animazione del loader
      pinchStartRef.current = performance.now();
      setConfirmProgress(0);

      // Aggiorna il progresso a 60fps tramite RAF
      const animateProgress = () => {
        const elapsed = performance.now() - (pinchStartRef.current ?? 0);
        const progress = Math.min(elapsed / PINCH_CONFIRM_MS, 1);
        setConfirmProgress(progress);
        if (progress < 1) {
          pinchAnimFrameRef.current = requestAnimationFrame(animateProgress);
        }
      };
      pinchAnimFrameRef.current = requestAnimationFrame(animateProgress);

      // Timer di conferma
      pinchTimerRef.current = setTimeout(() => {
        onAppOpen(focusedId);
      }, PINCH_CONFIRM_MS);

    } else {
      // Annulla — rilascio morbido
      if (pinchTimerRef.current) {
        clearTimeout(pinchTimerRef.current);
        pinchTimerRef.current = null;
      }
      if (pinchAnimFrameRef.current) {
        cancelAnimationFrame(pinchAnimFrameRef.current);
        pinchAnimFrameRef.current = null;
      }
      pinchStartRef.current = null;
      setConfirmProgress(0);
    }

    return () => {
      if (pinchTimerRef.current) clearTimeout(pinchTimerRef.current);
      if (pinchAnimFrameRef.current) cancelAnimationFrame(pinchAnimFrameRef.current);
    };
  }, [isPinching, focusedId, onAppOpen]);

  // ── Dati bolla focused ─────────────────────────────────────
  const focusedManifest = focusedId ? manifests.find(m => m.id === focusedId) ?? null : null;
  const focusedLayout = focusedId ? layouts.find(l => l.id === focusedId) ?? null : null;

  const isOtherFocused = focusedId !== null;

  const hasFocus = phase === 'focused' || phase === 'confirming';
  const isConfirming = phase === 'confirming' || (isPinching && focusedId != null);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 'var(--z-field)' as unknown as number,
        overflow: 'hidden',
      }}
    >
      {/* ── Negative space gradient ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(20,16,40,0.6) 0%, var(--color-void) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Bolle ── */}
      <AnimatePresence>
        {manifests.map((manifest) => {
          const layout = layouts.find(l => l.id === manifest.id);
          if (!layout) return null;
          return (
            <BubbleItem
              key={manifest.id}
              manifest={manifest}
              layout={layout}
              isHovered={hoveredId === manifest.id}
              isFocused={focusedId === manifest.id}
              isOtherFocused={isOtherFocused && focusedId !== manifest.id}
            />
          );
        })}
      </AnimatePresence>

      {/* ── Overlay informativo ── */}
      <BubbleOverlay
        manifest={focusedManifest}
        layout={focusedLayout}
        isVisible={hasFocus}
        isConfirming={isConfirming}
        confirmProgress={confirmProgress}
      />

      {/* ── Vignette bordi ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 100% 100% at 0% 0%, rgba(5,5,8,0.5) 0%, transparent 50%),
            radial-gradient(ellipse 100% 100% at 100% 100%, rgba(5,5,8,0.5) 0%, transparent 50%),
            radial-gradient(ellipse 100% 100% at 100% 0%, rgba(5,5,8,0.3) 0%, transparent 40%),
            radial-gradient(ellipse 100% 100% at 0% 100%, rgba(5,5,8,0.3) 0%, transparent 40%)
          `,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* ── DEBUG Hitboxes ── */}
      {isDebug && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
          {layouts.map(layout => {
            const { cx, cy } = getBubbleCenterPx(layout);
            const radius = getBubbleRadiusPx(layout);
            return (
              <div
                key={`debug-${layout.id}`}
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy,
                  width: radius * 2,
                  height: radius * 2,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  border: '1px dashed red',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)'
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

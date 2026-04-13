// ── useBubbleLayout.ts ───────────────────────────────────────
// Genera il layout statico delle bolle nel campo 2.5D.
// Seed deterministico per ID → stesse posizioni ad ogni render,
// senza randomicità instabile.
// ─────────────────────────────────────────────────────────────
import { useMemo } from 'react';
import type { AppManifest } from '@salvagente/shared-types';
import type { BubbleLayout, BubbleLayer, DriftVariant } from './types';

// ── Seeded pseudo-random ──────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

// ── Layout generation ─────────────────────────────────────────
const DRIFT_VARIANTS: DriftVariant[] = ['a', 'b', 'c'];
const LAYER_BY_SORT: (BubbleLayer)[] = [0, 1, 2, 1, 0, 2, 1, 0, 2];

const SIZE_BY_LAYER: Record<BubbleLayer, BubbleLayout['sizeVar']> = {
  0: '--bubble-size-sm',
  1: '--bubble-size-md',
  2: '--bubble-size-lg',
};

/**
 * Genera posizioni organiche con distribuzione a griglia morbida:
 * divide il viewport in celle e sposta randomicamente il centro
 * all'interno di ciascuna cella → evita sovraffollamenti e buchi.
 */
function generateLayout(manifests: AppManifest[]): BubbleLayout[] {
  const n = manifests.length;

  // Griglia: cerca rapporto colonne/righe più quadrato possibile
  const cols = Math.ceil(Math.sqrt(n * 1.4));
  const rows = Math.ceil(n / cols);

  // Padding dai bordi (%) per non far uscire le bolle troppo
  const padX = 8;
  const padY = 12;
  const cellW = (100 - padX * 2) / cols;
  const cellH = (100 - padY * 2) / rows;

  return manifests
    .slice()
    .sort((a, b) => a.presentation.sortWeight - b.presentation.sortWeight)
    .map((manifest, i) => {
      const rng = mulberry32(seedFromString(manifest.id));

      const col = i % cols;
      const row = Math.floor(i / cols);

      // Centro cella + jitter casuale all'interno della cella
      const jitterX = (rng() - 0.5) * cellW * 0.7;
      const jitterY = (rng() - 0.5) * cellH * 0.7;

      const cx = padX + col * cellW + cellW / 2 + jitterX;
      const cy = padY + row * cellH + cellH / 2 + jitterY;

      const layer = (LAYER_BY_SORT[i % LAYER_BY_SORT.length] ?? 1) as BubbleLayer;
      const driftVariant = DRIFT_VARIANTS[Math.floor(rng() * 3)] as DriftVariant;
      const driftDuration = 8 + rng() * 10; // 8–18s
      const driftDelay = -(rng() * driftDuration); // offset negativo → già "in moto"

      return {
        id: manifest.id,
        cx,
        cy,
        layer,
        driftVariant,
        driftDuration,
        driftDelay,
        sizeVar: SIZE_BY_LAYER[layer],
      };
    });
}

// ── Hook ──────────────────────────────────────────────────────
export function useBubbleLayout(manifests: AppManifest[]): BubbleLayout[] {
  return useMemo(() => generateLayout(manifests), [manifests]);
}

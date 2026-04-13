// ── catalog/types.ts ─────────────────────────────────────────
// Tipi specifici del catalogo bolle.
// AppManifest viene da @salvagente/shared-types.
// ─────────────────────────────────────────────────────────────
import type { AppManifest } from '@salvagente/shared-types';

/**
 * Layer di profondità della bolla nel campo 2.5D.
 * 0 = dietro (più piccole, più lente)
 * 1 = medio
 * 2 = davanti (più grandi, più veloci)
 */
export type BubbleLayer = 0 | 1 | 2;

/** Sequenza drift CSS da usare per la bolla */
export type DriftVariant = 'a' | 'b' | 'c';

/**
 * Layout calcolato per ogni bolla nel campo.
 * Generato una sola volta da useBubbleLayout.
 */
export interface BubbleLayout {
  id: string;
  /** Posizione base in % del viewport */
  cx: number;
  cy: number;
  layer: BubbleLayer;
  driftVariant: DriftVariant;
  /** Durata del loop drift in secondi */
  driftDuration: number;
  /** Offset di fase per non sincronizzare tutte le bolle */
  driftDelay: number;
  /** Dimensione in CSS (usa le variabili --bubble-size-*) */
  sizeVar: '--bubble-size-sm' | '--bubble-size-md' | '--bubble-size-lg';
}

/** Dati completi necessari a renderizzare una bolla */
export interface BubbleProps {
  manifest: AppManifest;
  layout: BubbleLayout;
  isHovered: boolean;
  isFocused: boolean;
  isOtherFocused: boolean; /** un'altra bolla è focused — attenua questa */
}

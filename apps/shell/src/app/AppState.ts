// ── AppState.ts ──────────────────────────────────────────────
// Tipi per la state machine della shell Salvagente.
// Nessuna dipendenza da React: puro TypeScript.
// ─────────────────────────────────────────────────────────────

/**
 * Le fasi della shell.
 *
 *  attract       → nessuna mano, catalogo in drift idle
 *  browsing      → mano presente, nessuna bolla focale
 *  hovered       → bolla "candidata" veloce (pre-stabilizzazione)
 *  focused       → bolla stabilizzata, overlay informativo visibile
 *  confirming    → pinch hold in corso (loader radiale attivo)
 *  transitioning → animazione di ingresso nella mini-app
 *  in-app        → mini-app montata e attiva
 *  returning     → animazione di uscita → ritorno catalogo
 */
export type AppPhase =
  | 'attract'
  | 'browsing'
  | 'hovered'
  | 'focused'
  | 'confirming'
  | 'transitioning'
  | 'in-app'
  | 'returning';

export interface AppStateSlice {
  phase: AppPhase;

  /** ID bolla rapidamente under pointer — aggiornamento più frequente */
  hoveredBubbleId: string | null;

  /** ID bolla stabilizzata — commit solo dopo isteresi */
  focusedBubbleId: string | null;

  /** ID della mini-app attualmente montata */
  activeAppId: string | null;

  /** Mano presente nel frame */
  isHandPresent: boolean;

  /** Pinch attivo */
  isPinching: boolean;
}

export interface AppStateActions {
  setPhase: (phase: AppPhase) => void;
  setHoveredBubble: (id: string | null) => void;
  setFocusedBubble: (id: string | null) => void;
  setActiveApp: (id: string | null) => void;
  setHandPresence: (v: boolean) => void;
  setPinching: (v: boolean) => void;
  /** Reset completo → attract, usato su exit e idle timeout */
  resetToAttract: () => void;
}

export type AppState = AppStateSlice & AppStateActions;

export const INITIAL_SLICE: AppStateSlice = {
  phase: 'attract',
  hoveredBubbleId: null,
  focusedBubbleId: null,
  activeAppId: null,
  isHandPresent: false,
  isPinching: false,
};

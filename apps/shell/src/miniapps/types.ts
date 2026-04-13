// ── miniapps/types.ts ─────────────────────────────────────────
// Tipi pubblici del contratto mini-app.
// ─────────────────────────────────────────────────────────────
import { lazy, ComponentType } from 'react';
import { SalvagenteCore } from '@salvagente/core-cv';
import type { MultiHandTracker } from '@salvagente/core-cv';

/**
 * Contratto base che ogni mini-app deve rispettare.
 * La shell inietta `core`, `onExit`, e il bridge multi-hand.
 * `tracker` e `activeHandCount` sono sempre presenti (iniettati dal MiniAppHost).
 */
export interface MiniAppProps {
  /** Istanza SalvagenteCore già avviata e configurata dalla shell */
  core: SalvagenteCore;
  /** Chiama per tornare al catalogo */
  onExit: () => void;
  /** Tracker multi-hand — sempre disponibile, anche senza mani attive */
  tracker: MultiHandTracker;
  /** Numero di mani attive (React state — causa re-render solo quando cambia) */
  activeHandCount: number;
}

/**
 * Alias semantico per mini-app che usano esplicitamente il multi-hand.
 * Identico a MiniAppProps, serve come documentazione dell'intenzione.
 */
export type MultiHandMiniAppProps = MiniAppProps;

/** Tipo del componente lazy — usato da registry e MiniAppHost */
export type MiniAppComponent = ReturnType<typeof lazy<ComponentType<MiniAppProps>>>;

// ── miniapps/types.ts ─────────────────────────────────────────
// Tipi pubblici del contratto mini-app.
// Estratti in file separato per spezzare la dipendenza circolare:
//   registry.ts → MiniAppHost.tsx → registry.ts (CICLO ❌)
//   registry.ts → types.ts        (OK ✅)
//   MiniAppHost.tsx → types.ts    (OK ✅)
// ─────────────────────────────────────────────────────────────
import { lazy, ComponentType } from 'react';
import { SalvagenteCore } from '@salvagente/core-cv';

/**
 * Contratto che ogni mini-app deve rispettare.
 * La shell inietta `core` già avviato e `onExit` come callback.
 */
export interface MiniAppProps {
  /** Istanza SalvagenteCore già avviata e configurata dalla shell */
  core: SalvagenteCore;
  /** Chiama per tornare al catalogo */
  onExit: () => void;
}

/** Tipo del componente lazy — usato da registry e MiniAppHost */
export type MiniAppComponent = ReturnType<typeof lazy<ComponentType<MiniAppProps>>>;

// ── registry.ts ───────────────────────────────────────────────
// Registro delle mini-app.
// Ogni entry associa un AppManifest al lazy component React.
//
// Per aggiungere una mini-app:
//   1. Crea il componente in apps/
//   2. Aggiungi una entry qui
//   3. La shell si occupa di tutto il resto
// ─────────────────────────────────────────────────────────────
import { lazy } from 'react';
import type { AppManifest } from '@salvagente/shared-types';
import type { MiniAppComponent } from './types';

export interface MiniAppEntry {
  manifest: AppManifest;
  component: MiniAppComponent;
}

export const MINI_APP_REGISTRY: MiniAppEntry[] = [
  // ── Mirror Flow ─────────────────────────────────────────────
  {
    manifest: {
      id: 'mirror-flow',
      title: 'Mirror Flow',
      shortDescription: 'Il tuo corpo diventa materia fluida. Ogni gesto lascia una scia di luce nello spazio.',
      interaction: {
        experienceType: 'contemplativa',
        primaryGesture: 'skeleton_full',
        gestureLabel: 'Muovi le mani lentamente — il flusso segue il corpo',
      },
      presentation: {
        bubbleAssetUrl: '',
        backgroundColor: '#0d0a20',
        visibilityStatus: 'published',
        sortWeight: 1,
      },
      capabilities: {
        requiresVideoBackground: false,
        readyForRecording: false,
      },
    },
    component: lazy(() => import('./apps/MirrorFlow.tsx')),
  },

  // ── Shadow Puppets ───────────────────────────────────────────
  {
    manifest: {
      id: 'shadow-puppets',
      title: 'Shadow Puppets',
      shortDescription: 'La tua silhouette proietta ombre animate. Scopri le forme che nascono tra le dita.',
      interaction: {
        experienceType: 'esplorativa',
        primaryGesture: 'skeleton_full',
        gestureLabel: 'Apri e chiudi le mani — le ombre prendono vita',
      },
      presentation: {
        bubbleAssetUrl: '',
        backgroundColor: '#0a1412',
        visibilityStatus: 'published',
        sortWeight: 2,
      },
      capabilities: {
        requiresVideoBackground: true,
        readyForRecording: true,
      },
    },
    component: lazy(() => import('./apps/ShadowPuppets.tsx')),
  },

  // ── Pulse Garden ─────────────────────────────────────────────
  {
    manifest: {
      id: 'pulse-garden',
      title: 'Pulse Garden',
      shortDescription: 'Il ritmo del tuo respiro fa sbocciare un giardino generativo. Rallenta e guarda crescere.',
      interaction: {
        experienceType: 'contemplativa',
        primaryGesture: 'pointer',
        gestureLabel: 'Tieni la mano ferma — ascolta il tuo ritmo',
      },
      presentation: {
        bubbleAssetUrl: '',
        backgroundColor: '#0a160e',
        visibilityStatus: 'draft', // non ancora pubblicata
        sortWeight: 3,
      },
      capabilities: {
        requiresVideoBackground: false,
        readyForRecording: false,
      },
    },
    component: lazy(() => import('./apps/MirrorFlow.tsx')), // placeholder
  },
];

/** Cerca un'entry per ID */
export function findRegistryEntry(id: string): MiniAppEntry | undefined {
  return MINI_APP_REGISTRY.find(e => e.manifest.id === id);
}

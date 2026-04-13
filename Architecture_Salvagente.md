# Architettura Tecnica - Salvagente

Questa è la proposta architetturale completa per **Salvagente**, progettata pensando nativamente a uno spazio tridimensionale, interazioni gesture-based e fluidità esecutiva.

---

### 1. Stack Consigliato e Motivazione
Lo stack deve garantire latenza vicina allo zero per la computer vision e alte performance di rendering (minimo 60fps) per non causare *motion sickness* visivo nell'utente.

*   **Core:** React 18 + TypeScript (rigoroso).
*   **Computer Vision:** `@mediapipe/tasks-vision` (HandLandmarker). Eseguito preferibilmente in un Web Worker dedicato per sgravare il main thread.
*   **Engine 3D (Catalogo Bolle):** `three.js` + `@react-three/fiber` (R3F) + `@react-three/drei`. Essenziale per creare uno scenario fluido, volumetrico, con profondità e sistemi particellari/fisici senza i limiti di reflow del DOM html classico.
*   **Fisica delle Bolle:** `@react-three/rapier` (o logica custom basata su spring/boids per movimenti più organici). Rapier offre gestione delle collisioni a zero-cost per far rimbalzare dolcemente le bolle tra loro.
*   **State Management:** `zustand`. Perfetto per gestire il frequency state continuo (coordinate X,Y,Z della mano, stato del pinch) evitando i re-render di massa tipici del Context API di React.
*   **Animazioni DOM (Transizioni e Overlay):** `framer-motion` per gestire in modo dichiarativo e matematicamente fluido l'HUD e le transizioni Shell ↔ Esperienza.

### 2. Tradeoff Vite vs Next.js
**Vite:**
*   *Pro:* HMR istantaneo, build times microscopici, nessuna configurazione SSR (Server-Side Rendering) complessa, perfetto per Single Page Applications (SPA) client-side heavy.
*   *Contro:* Nessun routing o gestione server API built-in (ma Salvagente non ne ha un disperato bisogno iniziale).

**Next.js:**
*   *Pro:* Ottimo per SEO, routing file-based strutturato, Server Actions.
*   *Contro:* Overhead enorme e conflitti frequenti nell'importare librerie WebGL/MediaPipe che *devono* girare sul client (`"use client"` ovunque, vanificando i vantaggi di Next).

**👉 Scelta Architetturale: VITE.**
Salvagente è essenzialmente un'applicazione interattiva "Kiosk" / WebGL *client-only*. Il SSR di Next.js aggiungerebbe solo layer di complessità (es. idratazione DOM mismatch con le canvas 3D e import di MediaPipe node-incompatibili). Useremo Vite in modalità SPA.

### 3. Struttura Repository (Monorepo)
Per garantire lo sviluppo in parallelo di diverse app e separare nettamente l'engine del tracking dalle interfacce, adotteremo un **Monorepo** basato su **pnpm workspace** (o Bun), e **Turborepo** per la velocità di build.

```text
salvagente/
├── apps/
│   └── shell/                 # Container principale (creato con Vite)
├── packages/
│   ├── core-cv/               # Engine MediaPipe, smoothing coordinate, signal processing
│   ├── engine-catalog/        # Logiche R3F, bolle, simulazione fisica spaziale
│   ├── shared-types/          # TS Interfaces globali (Manifest, Eventi, Math)
│   ├── ui-system/             # Componenti React puri (HUD, bottoni, pannelli Glassmorphism)
│   └── mini-apps/             # Ogni mini-app è un package isolato
│       ├── app-risveglio/
│       ├── app-soffio/
│       └── app-template/      # Boilerplate per creare rapidamente nuove esperenze
├── package.json
└── turbo.json
```

### 4. Mappa dei Package / Moduli
*   `@salvagente/shell`: Il punto di ingresso. Registra le mini-app, monta il canvas 3D o la vista mini-app a seconda dello stato di routing interno.
*   `@salvagente/core-cv`: Astrae MediaPipe. Espone hook generici (`useHandTracking`, `usePinchGesture`).
*   `@salvagente/engine-catalog`: Accetta una lista di config (Manifest) e renderizza il campo 3D di bolle. Intercetta i Raycaster.
*   `@salvagente/mini-apps/*`: Moduli *lazy-loaded* che contengono solo l'esperienza specifica scissa dal resto.

### 5. Boundary tra Shell, Core CV, Catalog Engine e Mini-app
Il principio principe è **Inversion of Control (IoC)** e **Decoupling**.
*   **Core CV non sa nulla della UI.** Emette flussi di dati (`{x, y, isPinching}`).
*   **Shell non sa nulla di WebGL.** Fornisce l'astrazione di pagina, gestisce il timeout-idle globale e fornisce il layout overlay (logo Naqah). Passa i dati del CV al Catalog o alla Mini-app attiva.
*   **Catalog Engine non carica il codice delle mini-app.** Carica *solo i Manifest* per dipingere le bolle. Emette un evento `onAppSelected(appId)` verso la Shell quando una bolla viene "pinzata".
*   **La Mini-app non sa di essere in un catalogo a bolle.** Si aspetta di ricevere dal suo wrapper uno streaming di coordinate della mano, e invoca un callback `onExit()` quando termina l'esperienza.

### 6. Contratto Standard di una Mini-app
Ogni pacchetto in `packages/mini-apps/` deve esportare di default due cose:
1. Un oggetto `Manifest`.
2. Un componente React predefinito che aderisce a questa interfaccia:

```tsx
import type { StandardHandPose } from '@salvagente/shared-types';

export interface MiniAppProps {
  // Feed normalizzato dal Core CV (0-1), a 60fps
  handPose: StandardHandPose | null;
  // Trigger di chiusura controllata per tornare al catalogo
  onRequestExit: () => void;
  // Risorsa condivisa per audio global mixer (opzionale)
  audioContext?: AudioContext;
  // Contesto utente (es. bounding box per effetti di presenza)
  userPresenceBox?: BoundingBox;
}

export default function AppRisveglio({ handPose, onRequestExit }: MiniAppProps) { ... }
```

### 7. Manifest Architecture
Il Manifest è la "carta d'identità" usata per vestire la bolla nel catalogo.
Deve essere serializzabile.

```ts
export interface AppManifest {
  id: string;                      // es: "naqah.app.risveglio"
  title: string;                   // Titolo leggibile
  description: string;             // Breve microcopy evocativo (max 2 righe)
  categories: string[];            // es: ['Meditativo', 'Cinematico']
  bubbleStyle: {
    baseColor: string;             // Es. Hex "#ffcc00" o envMap name
    materialType: 'glass' | 'iridescent' | 'matte';
    thumbnailUrl?: string;         // Immagine/Texture interna alla bolla
    customShaderSrc?: string;      // (Avanzato) per bolle procedurali fluide
  };
  gestureHints: {
    primaryIcon: 'pinch' | 'wave' | 'hold';
    helperText: string;            // es: "Sfiora per aprire"
  };
  authoring: {
    brandOverride?: string;        // Se una bolla è brandizzata diversamente
  }
}
```

### 8. Catalog Bubble Engine Architecture
Lo spazio non è una griglia, ma un volume fisico di fluidodinamica.
*   **State:** Mappatura spaziale continua di $N$ bolle. Ogni bolla è un *InstancedMesh* in R3F (per renderizzare fino a centinaia di bolle a costo GPU quasi nullo).
*   **Fisica:** Usa un algoritmo di "Steering Behaviors" (Boids) combinato con molle (Springs).
    *   *Separation:* Le bolle non si accavallano perfettamente, si allontanano gentilmente.
    *   *Cohesion:* Tendono a rimanere nel campo visivo della telecamera orbitando verso il centro (attrazione elastica debole al centro 0,0,0).
    *   *Wander:* Un leggero rumore di Perlin muove lentamente i vettori velocità base per tenerle "vive".
    *   *Space Wrap:* Se una bolla sfora l'asse X (es. $X > 5$), viene teletrasportata a $X = -5$ (dietro la camera) conservando velocità, creando un ecosistema infinito laterale.

### 9. Interaction Architecture (Pointing + Pinch)
L'interaction deve subire una severa sanitizzazione:
1.  **Dati RAW:** La telecamera legge i nodi MediaPipe.
2.  **Smoothing Filter (1€ Filter / Kalman):** *Obbligatorio*. Rimuove le vibrazioni naturali della mano tenendo il puntatore fluido ma reattivo ai cambi di direzione improvvisi.
3.  **Raycaster Dinamico:** Dalla camera virtuale di R3F, il puntatore lancia un raggio 3D nello spazio delle bolle.
4.  **Hitbox Magnetica:** La collision shape spaziale (Sfera) di ogni bolla è del 30-40% più larga della bolla visiva. Quando intersecata, subentra una forza repulsiva al mouse che "cattura" il cursore vicino al centro, e blocca il movimento "Wander" spaziale di quella specifica bolla.
5.  **Pinch Detection:** Basato sulla distanza euclidea spaziale (D) tra pollice (nodo 4) e indice (nodo 8). Se $D < TriggerThreshold$, scatta il PinchStart.
6.  *Intention Locking:* Il Pinch non apre immediatamente. Avvia un timer (es. 400ms) o una barra circolare di riempimento. Se si rilascia il pinch prima, l'azione è interrotta. Se completa, viene emesso `onSelectionConfirmed()`.

### 10. Routing Architecture
*Non usiamo React Router e non passiamo da URL.*
Modello a **Stati a Macchina a Stati Finiti (XState / Zustand)**, mantenuto tutto in memoria:
`[ IDLE ] ↔ [ ROOT_CATALOG ] ↔ [ TRANSITION ] ↔ [ MIN_APP_RUNNING ]`

Questo permette di pre-caricare e montare in background il canvas della mini-app, mantenere il `display: none;` e poi attuare una transizione fluida (es. *Zoom-In nella Bolla*) in cui la bolla si spalma a schermo intero rivelando la mini-app, senza il flash bianco del caricamento pagina.

### 11. Shared Services Architecture
Per evitare che Shell, Core e App re-istanzino componenti pesanti:
*   *CameraManager:* Wrapper WebRTC `getUserMedia()`. Richiede i permessi una sola volta al mount della pagina. Il feed video ($640 \times 480$, ottimale per la CV) va a riempire un `<video>` nascosto condiviso.
*   *CV Engine Loop:* Esiste un solo requestAnimationFrame globale per le predizioni IA. Pusherà nello store Zustand `usePosesStore.setState({ frames })`. Componenti sparsi semplicemente si iscrivono in lettura (`usePosesStore(s => s.hand)`), azzerando prop-drilling e lag di re-render.
*   *IdleMonitor:* Servizio hook globale che ascolta eventi dal CV Engine. Se l'utente svanisce dal frame ottico per $>15s$, emette l'evento per forzare lo stato del Router su `ROOT_CATALOG` smontando le app e ripristinando pulito.

### 12. Data Model Essenziale del Catalogo
Molto sottile:
```ts
const useCatalogStore = create((set) => ({
   manifests: [],          // array di AppManifest caricati dinamicamente dal registry
   hoveredAppId: null,     // null | string
   interactingAppId: null, // mentre dura il pinch-to-fill
   activeAppId: null,      // se diverso da null, la Shell sta visualizzando quest'app
   setHover: (id) => set({ hoveredAppId: id }),
   confirmSelection: (id) => set({ activeAppId: id })
}))
```

### 13. Testing Strategy
Il test E2E umano basato su webcam rallenta lo sviluppo. Dobbiamo virtualizzarlo.
*   **Unit Tests (Vitest):** Per logica pura (smoothed data, calcolo della distanza del pinch, filtri).
*   **Data-Driven Mocking:** Permettere in `.env.development` di caricare file JSON contenenti un "Playback" pre-registrato di gesti MediaPipe. Invece della webcam vera, un servizio pesca dati ciclici da lì. Fondamentale per i test E2E in Playwright/Cypress.
*   **Visual Regression:** Scattare frame del catalog in vari breakpoint con le bolle iniettate in posizioni fisse note, verificando che il material rendering (Shaders) funzioni correttamente.

### 14. Workflow per Team Multi-Agent / Parallel Development
*   **Agent/Dev A (Core Infrastrutture):** Si occupa solo del workspace `core-cv` e `shell`. Produce un tool per visualizzare le ossa della mano su sfondo nero e assicura il payload a 60fps nello Zustand.
*   **Agent/Dev B (Catalog Design):** Lavora isolato nel `engine-catalog` alimentandolo con dummy data JSON e il puntatore del mouse che "simula" la mano per validare fuidodiffusione, gravità e hover.
*   **Agent/Dev C, D (App Builders):** Sviluppano le mini app in Vite "standalone". Un apposito file `dev-wrapper.tsx` presente nei loro workspace injecta un mock locale del Core CV per permettergli di lavorare sul proprio widget senza lanciare e testare l'intera struttura mastodontica di Salvagente.

### 15. Rischi Architetturali da Evitare (Red Flags)
1.  **Re-render del Canvas su variazione UI:** Separare drasticamente il DOM 2D overlay (testi, glass panels) dall'interno del Canvas R3F. Un re-render del nodo padre provocherebbe la distruzione e ricostruzione del motore WebGL causando freezing gravi.
2.  **Garbage Collection Spikes:** Creare massivamente nuovi vettori o oggetti dentro i `useFrame` o cicli IA anziché usare Object Pooling o instanziare oggetti fuori dal loop. La GC stutters uccide "l'organicità" visiva.
3.  **Accoppiamento Forte:** Se una mini-app importa direttamente MediaPipe o tenta di chiedere l'accesso alla webcam autonomamente si crea concorrenza fatale di periferica. Passate sempre per i Context/Store globali.
4.  **Assenza di isteresi (Hysteresis):** Sensori rumorosi causano trigger di ingresso e uscita contigui se la mano oscilla sulla linea di soglia. Un pinch, per "rilasciarsi" non deve tornare solo alla distanza $D$, ma a $D + Margin$.

### 16. Roadmap Tecnica di Implementazione
*   **Step 1. Scaffolding (Settimana 1):** Setup pnpm monorepo. Scaffold pacchetti vuoti. Implementazione Store globale (Zustand) e pattern Mocks.
*   **Step 2. CV & Backbone (Settimana 1-2):** Integrazione MediaPipe in WebWorker, filtro 1€ completato, emissione feed `StandardHandPose`. Pipeline di base `Camera -> Core -> Store`.
*   **Step 3. Bubble Space (Settimana 2-3):** R3F init. Posizionamento InstancedMeshes sferiche guidate da logica boid/spring con dati array fisso. Gestione del raycaster mano->3D spaziale.
*   **Step 4. UX Loop (Settimana 3-4):** Sviluppo degli hit-states (Focus, Magnetismo). Inserimento del DOM Overlay Glassmorphism diegetico posizionato rispetto al vector object in 3D. Logica *Pinch-to-Fill* per conferma.
*   **Step 5. App Container Integration (Settimana 4):** Cablaggio logico dello State Router. Creazione di una `AppTemplate` essenziale e testing della morbidezza di transizione Shell $\to$ App $\to$ Ritorno (Idle timeout working).
*   **Step 6. Estetica e Performance Review:** Passaggio finale sugli Shaders delle bolle, post-processing (Bloom, Dof su livelli arretrati), profiliazione memoria e memory leak check sui cambi app ripetuti.

# Architecture V2 Consolidata - Salvagente

## 1. Cosa mantieni invariato dell'architettura attuale
- **Local-First & Privacy By Design**: MediaPipe resta il core per l'inferenza CV rigorosamente client-side. Zero stream video verso l'esterno.
- **Root Experience a Bolle**: Il catalogo immersivo in cui le bolle fungono da punto di accesso.
- **Workflow di Engagement (Hover + Pinch)**: "Hover prolungato" con focus visivo + UI che dichiara l'app, seguito da "Pinch" per attivare. Questo è l'unico modo per limitare la Cognitive Load e i falsi positivi.
- **Shell Comune come Contenitore**: L'esistenza di un'applicazione Host (Salvagente Shell) che gestisce lo stato dell'app attiva e inietta il contesto alle singole mini-app.
- **Fallback Automagico (Idle Timeout)**: Il ripristino forzato e autonomo allo stato inziale quando la mano sparisce o non accade nulla (salvavita per installazioni).

## 2. Ambiguità o rischi principali dell'architettura attuale
- **Boundary Rendering Core/UI confuso**: Tentare di fare tutto tramite un layer ibrido Canvas/DOM minacciava le performance. Non era chiaro chi fosse responsabile del rendering del cursore vs input.
- **Overengineering del 3D**: Cercare di implementare una fisica avanzata delle bolle (N-Body, collisioni elastiche pure) rischia di assorbire mesi, introducendo instabilità di UI (difficoltà di puntamento se la bolla si sposta costantemente e autonomamente).
- **Isolamento Moduli (Iframe o no?)**: Un forte sandboxing via Iframe, benché teoricamente corretto, impedisce una condivisione fluida e a zero latenza dello scheletro MediaPipe (pose data a 60fps). PostMessage si saturerebbe rapidamente.
- **Stato di Navigazione Fragile**: La dipendenza da routing tradizionale (URL/History API) per un prodotto eventistico introduce edge case e ritorni indietro indesiderati (es. reload brutali, back button).

## 3. Decisioni architetturali bloccate per la v1
- **Il Catalogo in V1 sarà un 2.5D Convincente**: Nessun WebGL complesso o Three.js. Useremo DOM standard (React + Framer Motion o CSS vars). Le animazioni simuleranno profondità (scale, blur, parallax) e le bolle fluttueranno con easing ciclici precalcolati o pseudo-random lenti. Le Hitbox non scapperanno dal cursore.
- **Integrazione Mini-app via Lazy React Components**: Niente Iframe. Le app sono componenti React caricati dinamicamente nel medesimo DOM (Dynamic Imports). Condividono lo stesso thread e accedono allo Skeleton Context a latenza zero.
- **Modello di Puntamento: 2D Mapped Pointer**: Nessun raycast vettoriale 3D dalla mano. Estraiamo il landmark primario della mano (es. indice/palmo), lo filtriamo per togliere rumore, e lo mappiamo in coordinate `(x, y)` assolute/relative allo schermo.
- **Navigazione via Macchina a Stati in Memoria**: Niente URL routing. Usiamo un `MemoryRouter` custom della Shell. Esiste uno stato globale `activeAppId: string | null`. Questo impermeabilizza l'app da shortcut o navigazioni spurie.

## 4. Decisioni posticipate a fasi successive
- Renderizzatore WebGL reale per fisica attrattiva tra sfere e deformazioni di fluidi complessi.
- Funzionalità di Recording e Generazione QR-Code per output social della performance.
- True Sandboxing avanzato (Iframe render channel isolati, se diventeranno necessari o supportati nativamente senza overhead).
- Hand Gestures complesse addizionali come Swipe, Slap, o Rotazione palmo per UI standard. Rimaniamo concentrati solo su Pointer + Pinch.

## 5. Architecture v2 consolidata completa
L'architettura si sedimenta in **5 Layer chiari e unidirezionali**:

1. **Naqah CV Engine (Worker layer):** Loop headless di elaborazione via MediaPipe. Estrae nudi landmarks a 30-60hz. Nessuna logica UI.
2. **Gesture & Smoothing Core:** Wrapper logico che prende i landmarks crudi, applica un *low-pass filter* (lerp) per ammorbidire i tremolii, stabilisce se c'è un pinch tramite calcolo distanza polpastrelli, e sforna uno state normalizzato: `CursorState { x, y, isPinching, isHandPresent, rawSkeleton }`.
3. **Salvagente Global Shell (Interaction Context):** Layer React che detiene il Context del `CursorState`. Inizializza l'Overlay UI indipendente dal DOM sottostante e gestisce le transizioni globali (Fade in/out), il cursore della mano a schermo e lo State Router in memory (`activeApp`).
4. **Root Bubble Catalog:** Un componente che legge il Registro e renderizza l'array geometrico di Moduli. Contiene la logica per la "forgiving hitbox": calcola la vicinanza `(x,y)` del puntatore ai quadranti delle bolle per innescare l'Hover, e usa un timeout basato su `isPinching` in loop per confermare l'ingresso.
5. **Mini-App Sandbox:** Istanze React mountate full-width e full-height, che ricevono libero accesso al `CursorState` dal contesto genitore per far gestire la propria UX interna. Obbligate a implementare e onorare una Callback nativa `onExit()`.

## 6. Manifest v2 proposto
Il registro si basa su un array di questo payload contrattualizzato:

```typescript
export interface AppManifest {
  id: string;                      // Es. 'soffio'
  title: string;                   // 'Soffio'
  shortDescription: string;        // 'Allontana pensieri muovendo l'aria'
  
  // Risoluzione a run-time
  componentLoader: () => Promise<{ default: React.ComponentType }>;
  
  // UX Hints per catalog e router
  interaction: {
    experienceType: 'contemplativa' | 'attiva' | 'esplorativa';
    primaryGesture: 'pointer' | 'pinch' | 'skeleton_full';
    gestureLabel: string;          // 'Pinch per entrare' (da usare nell'HUD bolla)
  };
  
  presentation: {
    bubbleAssetUrl: string;        // Webm / Image / shader params
    backgroundColor: string;       // HEX Fallback in transizione
    visibilityStatus: 'published' | 'draft' | 'hidden';
    sortWeight: number;            // Organizzazione nell'attract loop
  };

  capabilities: {
    requiresVideoBackground: boolean; // Se l'app richiede il pass-through webcam oltre allo skeleton
    readyForRecording: boolean;       // Future-ready flag
  };
}
```

## 7. Boundary definitivi tra i moduli
La regola fondamentale è il "non-scavalcamento":
- **Core CV**: Mai manipolare l'UI. Emette solo Raw Data framerate-bound.
- **Gesture Layer**: Mai chiamare l'Engine Catalog. Emette solo uno stato "Pulito" dello scheletro e puntatore.
- **Shell Context**: Mai eseguire logica MediaPipe. Fornisce semplicemente a cascata il pointer interpolato. Disegna il Cursore UI svincolato dall'albero del React Main per evitare re-render eccessivi, e gestisce l'Idle Timeout.
- **Bubble Engine**: Legge point collision, comanda animazioni 2.5D. Ignora lo scheletro. Si occupa solo dello strato Router per chiedere l'avvio della Mini-App.
- **Mini-App**: Mai provare a leggere MediaPipe crudo direttamente dal layer 1. Si fida del Context genitore. Costruita agnosticamente come un gioco React-based che potrebbe funzionare persino con il mouse (per simulare il pointer in dev).

## 8. Strategia di fallback e resilienza
Sono definite le polizze assicurative contro "l'abbandono evento" e hardware:
1. **Pinch Rumoroso (Isteresi)**: Il range di scatto "Pinch On" è < 3cm, lo scatto "Pinch Off" è > 5cm. Evita accensioni/spegnimenti al millimetro per mani tremanti. L'attivazione richiede tra 300 e 500ms fissi per evitare selezioni accidentali nel passaggio della mano.
2. **Hand Lost Temporaneo (0-2s)**: Se MediaPipe perde il landmark per un fotogramma sghembo, il cursore si congela (`lerp` a 0) mantenendo lo stato. Nessuno scatto brusco. Dopo 2s svanisce morbido e la bolla perde hover.
3. **No Hand Present Permanente (>10s / Global Idle Timeout)**: La Shell dispone di un Watchdog. Se per X secondi in root o Y secondi nell'app attiva non c'è mani visibili, la Shell disattiva l'istanza mini-app e riforza lo stato MemoryRouter a `null`. Transizione "Nero/Sipario" per coprire scatti brutal.
4. **Decoupling Framerate (Anti-Lag)**: Se MediaPipe arranca a 15fps, la UI di React/CSS/Canvas DEVE girare a 60fps usando un Damper/Spring. Il cursore "galleggerà morbidamente" verso le coordinate diradate in input.

## 9. Roadmap tecnica aggiornata e più realistica
- **Milestone 1 (Foundation):** Setup Repositories, React Shell, Worker MediaPipe e Hook interpolazione cursore (`useSmoothedHand`). Il mouse web simula la mano in attesa della cam.
- **Milestone 2 (App Shell & Context):** Memory Router funzionante, Error Boundaries, inserimento watchdog Timeout ed Exit System.
- **Milestone 3 (Catalogo V1 - The 2.5D Mock):** Array React di div arrotondati, testati su Framer Motion per parallax float. UI dell'Hover State HUD basato sul blocco Hitbox.
- **Milestone 4 (Pinch Selection Layer):** Test logica `Pinch -> Loading Radiale -> Mount componente`. L'ingresso asincrono. Sviluppo app fittizie "Dummy A" e "Dummy B" per testare andata e ritorno.
- **Milestone 5 (Refinement Visivo & Integrazione Naqah Component library):** Aggiunta Brand Salvagente, pass-through shader visivi, glassmorphism e video background se le miniapp lo necessitano per configurazione.

## 10. Rischi residui che richiedono prototipo o test
- **React State vs Performance Cursore (Rischio mitigato da Decisione Architetturale)**: Spingere dati posizionali continui `(x, y)` tramite React `useContext` globale a 60fps distruggerebbe le performance. **Decisione bloccante**: il tracking continuo usa un layer imperativo (store esterno custom o `useRef` + `requestAnimationFrame`) per muovere il cursore svincolato dal render tree; l'aggiornamento reattivo (`setState` / Context) verrà scatenato *solo* per gli eventi discreti binari ("isPinching", "handLost", "cambio app").
- **Ergonomia Hitbox sul monitor di target (Asimmetria Campo/Vista)**: Il braccio fermo in basso ha un field d'azione piccolo. Quanto deve essere grossa la bolla/hitbox in percentuale schermo per non richiedere slanci ginnici? Sarà imperativo testare davanti allo schermo reale con hardware preposto. Serve un tool in alpha che disegna a schermo il tracciamento grezzo per tarare logiche spaziali e i moltiplicatori di ampiezza.

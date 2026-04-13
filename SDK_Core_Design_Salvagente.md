# Salvagente Core SDK - Architecture & Implementation
Generato per il sistema modulare di mini-app Salvagente.

## 1. Executive Summary Architetturale
Il Salvagente Core SDK è una libreria TypeScript agnostica e puramente logica, progettata per isolare la complessità della computer vision basata su MediaPipe dal layer di rendering (UI e mini-app). Il suo scopo è trasformare un feed crudo e "rumoroso" di punti tridimensionali (Landmarks) in un flusso di **eventi stabili e intenzionali** (es. coordinate del cursore a 60fps lisci, trigger di "Pinch In/Out" con isteresi, rilevamento presenza/assenza della mano). Le mini-app non vedranno mai MediaPipe; si fideranno unicamente dell'API di alto livello (il *CursorState*) esposta da questo SDK.

## 2. Moduli del Core
L'SDK è diviso in sottomoduli con responsabilità strettamente separate:
*   **MediaPipe Integration (`/cv`)**: Inizializza l'istanza raw di HandLandmarker delegata all'estrazione, opzionalmente confinata in Web Worker.
*   **Webcam & Loop Manager (`/camera`)**: Gestisce `getUserMedia`, il loop video a framerate nativo visivo tramite `requestVideoFrameCallback`.
*   **Smoothing & Math (`/math`)**: Motore deterministico per applicare Low-Pass Filters (Lerp/Damper) e smorzare i tremolii fisiologici del machine learning.
*   **Interaction & Gestures (`/gestures`)**: Calcolatori algoritmici. Trasformano i punti lisciati in stati semantici (Pinch attivo, Rilascio, Quantità dita estese).
*   **Event Emitter Facade (`/core`)**: L'hub centrale singleton che invia il segnale in broadcast, a cui il Global State di Salvagente (e le mini-app a cascata) si abbonano.

## 3. Tipi Pubblici Fondamentali
Ecco i tipi esportati con cui le mini-app (o lo Shell Context) "parleranno":

```typescript
// types.ts
export interface Point2D { x: number; y: number; }
export interface Point3D extends Pick<Point2D, 'x' | 'y'> { z: number; }

export type GestureType = 'idle' | 'pinch' | 'open_palm' | 'closed_fist';

export interface CursorState {
  // Coordinate del cursore interpolate e stabilizzate [0.0...1.0] relative allo schermo
  position: Point2D; 
  
  // Variabili di interazione ad alta affidabilità per UI
  isPinching: boolean;       // Con isteresi (es. non flotta al confine)
  isHandPresent: boolean;    // C'è una mano nell'inquadratura in questo momento?
  
  // Riconoscimento semantico avanzato
  activeGesture: GestureType;
  extendedFingersCount: number; // 0 a 5
}

export interface RawSkeleton {
  landmarks: Point3D[];       // Tutti i 21 punti della mano crudi 
  handedness: 'Left' | 'Right';
  score: number;
}

export interface CoreEventMap {
  'stateChange': (state: CursorState) => void;
  'skeletonUpdate': (skeleton: RawSkeleton) => void; // Solo per app che vogliono il 3D
  'handLost': (timeSinceLossMs: number) => void;
  'handDetected': () => void;
  'error': (err: Error) => void;
}
```

## 4. API Pubblica del Core SDK
L'API esposta deve essere semplice, quasi simile a un sensore hardware native:

```typescript
import { SalvagenteCore } from '@salvagente/core';

// 1. Istanza
const engine = new SalvagenteCore({
  smoothingFactor: 0.25, // Più alto = Più lag ma più morbido
  pinchThresholdOn: 0.04, 
  pinchThresholdOff: 0.07 // Isteresi > On per non sganciare
});

// 2. Registrazione Eventi
engine.on('stateChange', (state: CursorState) => {
   // Muovi mouse, trigger click...
});

// 3. Avvio
await engine.start(videoElement); // Init camera & mediapipe

// 4. Pausa/Ripresa (utile per consumare meno quando iddle)
engine.pause(); 
engine.resume();

// 5. Smantellamento totale
engine.destroy();
```

## 5. Lifecycle Corretto
1.  **Instanziamento**: Nessun footprint pesante al `new SalvagenteCore()`.
2.  **Initialization (`start()`)**:
    *   Richiede i permessi fotocamera (`navigator.mediaDevices.getUserMedia`).
    *   Scarica in modo asincrono i task WASM di MediaPipe.
    *   Se `start` è completato, la luce verde del tracking è accesa, ma `handPresent = false`.
3.  **Active Loop**: Usa `requestVideoFrameCallback` legata all'elemento video. Esegue tracking grezzo $\rightarrow$ Math smoothing $\rightarrow$ Calcolo Gesture $\rightarrow$ Event Emit.
4.  **Suspension**: Per abbassare il consumo CPU (es. overlay "Tocca per svegliare"), il loop si blocca con `pause()`. Il video stream magari resta acceso ma MediaPipe si ferma.
5.  **Destruction**: Ferma le tracce video della cam, termina gli istanze WASM di mediapipe (fondamentale per evitare leak di memoria), resetta lo stato.

## 6. Gestione Webcam, Tracking e Smoothing
Il cuore logico che difende dalle imprecisioni.
MediaPipe restituisce l'indice (Landmark n.8) e il pollice (n.4) che tremolano costantemente per via della predizione ML frame-per-frame.
Prima di inviarlo alla UI, il Core SDK incanala il tracking in un filtro *Low-Pass (Lerp)*:

```typescript
class Smoother {
  private currentX = 0;
  private currentY = 0;
  private dmp = 0.2; // 0.0(Zero damp) -> 1.0(Total damp)

  next(targetX: number, targetY: number): Point2D {
    this.currentX += (targetX - this.currentX) * this.dmp;
    this.currentY += (targetY - this.currentY) * this.dmp;
    return { x: this.currentX, y: this.currentY };
  }
  
  reset(x: number, y: number) {
    this.currentX = x; this.currentY = y;
  }
}
```
*   **Gestione 'Hand Lost'**: Se per un frame non vedo la mano, NON azzero tutto. Mantengo il cursore *congelato* nella posizione attuale. Se supero `maxLostFrames` (es. 10 frames, ~300ms), scateno l'evento `handLost` per sganciare mollemente. 

## 7. Gesture Layer Estendibile (Pinch + Isteresi)
MediaPipe non sputa fuori un evento "Pinch". Noi dobbiamo derivarlo calcolando la Distanza Euclidea tra Pollice (Tip, L4) e Indice (Tip, L8).
L'Isteresi impedisce il "Pinch-flickering" vicino alla soglia:

```typescript
class PinchDetector {
  private isPinching = false;
  
  constructor(public thresOn: number, public thresOff: number) {}

  update(thumb: Point3D, index: Point3D): boolean {
    const dist = Math.hypot(thumb.x - index.x, thumb.y - index.y, thumb.z - index.z);
    
    if (!this.isPinching && dist < this.thresOn) {
      this.isPinching = true;
    } else if (this.isPinching && dist > this.thresOff) {
      this.isPinching = false;
    }
    return this.isPinching;
  }
}
```

## 8. Diagnostics e Error Handling
Il Core SDK non gestisce l'UI d'errore ma emette chiari segnali.
*   **CameraError**: Se l'utente nega i permessi o la camera si stacca (Hardware drop).
*   **WasmError**: Se il CND fallisce, errore fatale.
*   **Performance Diagnostics**: Se il loop impiega >32ms a girare (crollo frame <30 FPS), emette un warning `fpsDrop` che permette alla Shell di avvisare "Illuminazione scarsa o PC lento".

## 9. Struttura File Consigliata
```text
salvagente/
  packages/
    core-cv/
      src/
        SalvagenteCore.ts      // Facade Class Singletone-style
        index.ts               // Exports di libreria
        types/                 // Tipi esportati
          core.types.ts
        cv/
          camera.ts            // initMedia() stream wrapper
          MediaPipeManager.ts  // Wrapper per HandLandmarker 
        math/
          smoothing.ts         // LowPassFilter & Spring physics
          geometry.ts          // distance2D, distance3D
        gestures/
          pinch.ts             // PinchDetector (Isteresi)
          extendedFingers.ts   // Count logic
        utils/
          EventEmitter.ts      // Vanilla event emitter per pub/sub
```

## 10. Implementazione Iniziale (Codice TypeScript Reale)

Ecco una preview architetturale del Facade principale. Codice reale per il wrapper:

```typescript
// SalvagenteCore.ts
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { EventEmitter } from "./utils/EventEmitter";
import { Smoother } from "./math/smoothing";
import { PinchDetector } from "./gestures/pinch";
import { CursorState, CoreEventMap } from "./types/core.types";

export class SalvagenteCore extends EventEmitter<CoreEventMap> {
  private landmarker: HandLandmarker | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private isRunning = false;
  private lastVideoTime = -1;
  
  // Sub-modules
  private pointerSmoother = new Smoother(0.25);
  private pinchDetector = new PinchDetector(0.04, 0.08); // Isteresi On/Off
  
  // State
  private missFrameCount = 0;
  private readonly MAX_MISS_FRAMES = 15;
  private currentState: CursorState = {
    position: { x: 0.5, y: 0.5 },
    isPinching: false,
    isHandPresent: false,
    activeGesture: 'idle',
    extendedFingersCount: 0
  };

  async start(video: HTMLVideoElement) {
    this.videoEl = video;
    
    // Inizializza MediaPipe (WASM setup)
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    
    this.landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU" // or CPU fallback
      },
      runningMode: "VIDEO",
      numHands: 1, // Single hand MVP
    });

    this.isRunning = true;
    requestAnimationFrame(this.visionLoop);
  }

  private visionLoop = () => {
    if (!this.isRunning || !this.videoEl || !this.landmarker) return;

    const timeNow = performance.now();
    
    // Processa solo se c'è un nuovo video frame per risparmiare risorse
    if (this.videoEl.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.videoEl.currentTime;
      const results = this.landmarker.detectForVideo(this.videoEl, timeNow);
      
      this.processResults(results);
    }
    
    requestAnimationFrame(this.visionLoop); // Loop continuo
  }

  private processResults(results: any) {
    if (results.landmarks && results.landmarks.length > 0) {
      // 1. Trovata una mano
      const hand = results.landmarks[0]; // Prendiamo la mano primaria per ora
      const indexTip = hand[8];  // MediaPipe Landmark Index
      const thumbTip = hand[4];
      const wrist = hand[0]; // Per root reference

      // 2. Resilienza/Hand Detected
      if (!this.currentState.isHandPresent) {
        this.pointerSmoother.reset(indexTip.x, indexTip.y); // Snap per non fare slide dal bordo
        this.currentState.isHandPresent = true;
        this.emit('handDetected');
      }
      this.missFrameCount = 0;

      // 3. Smoothing coordinate (Scegliamo l'indice come pointer master)
      const smoothedPos = this.pointerSmoother.next(indexTip.x, indexTip.y);

      // 4. Gesture Inference (Pinch)
      const isPinch = this.pinchDetector.update(thumbTip, indexTip);

      // 5. Update state
      this.currentState = {
        ...this.currentState,
        position: smoothedPos,
        isPinching: isPinch,
        activeGesture: isPinch ? 'pinch' : 'open_palm'
      };

      this.emit('stateChange', this.currentState);
      this.emit('skeletonUpdate', { landmarks: hand, handedness: results.handednesses[0][0].category, score: results.handednesses[0][0].score });
      
    } else {
      // Mano Persa (Forgiving Dropout)
      this.missFrameCount++;
      if (this.missFrameCount > this.MAX_MISS_FRAMES && this.currentState.isHandPresent) {
        this.currentState.isHandPresent = false;
        this.currentState.isPinching = false; // Forza rilascio per sicurezza
        
        this.emit('stateChange', this.currentState);
        this.emit('handLost', this.missFrameCount * 16.6); // Time lost
      }
    }
  }

  stop() {
    this.isRunning = false;
    this.landmarker?.close();
  }
}
```

## 11. Esempio Minimo d'Uso (React Mini-App/Shell)

Come la Shell React consuma questo Core. Nota che non sa niente di MediaPipe, conosce solo il `CursorState`.

```tsx
import React, { useEffect, useState, useRef } from 'react';
// Il Core gira in un Context o come Provider Singleton
import { useSalvagenteContext } from '@core/react-bindings';

export const BubbleCatalog: React.FC = () => {
  const { core } = useSalvagenteContext();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isPinchingGlobal, setIsPinchingGlobal] = useState(false);

  useEffect(() => {
    // Il posizionamento continuo avviene *FUORI* da React state per massime performance (60fps DOM manip)
    const handleState = (state: CursorState) => {
      // 1. Move Cursor UI
      if (cursorRef.current && state.isHandPresent) {
        // Conversione 0..1 in pixel (CSS viewport coords)
        const vX = state.position.x * window.innerWidth;
        const vY = state.position.y * window.innerHeight;
        cursorRef.current.style.transform = `translate(${vX}px, ${vY}px)`;
        
        // Visual feedback per pinch
        if (state.isPinching) {
            cursorRef.current.classList.add('cursor-pinched');
        } else {
            cursorRef.current.classList.remove('cursor-pinched');
        }
      }
      
      // 2. React State solo per transizioni lente binarie (Aumenta Performance)
      if (state.isPinching !== isPinchingGlobal) {
         setIsPinchingGlobal(state.isPinching); // Trigger React re-render per l'HUD solo quando cambia!
      }
    };

    core.on('stateChange', handleState);
    return () => core.off('stateChange', handleState);
  }, [core, isPinchingGlobal]);

  return (
    <div className="catalog-wrapper">
       <div ref={cursorRef} className="global-cursor" style={{ position: 'absolute', pointerEvents: 'none' }} />
       {/* Logica delle bolle qui */}
       <h1>{isPinchingGlobal ? "Hai agganciato!" : "Galleggia..."}</h1>
    </div>
  );
}
```

## 12. Test Strategy 
*   **Virtualizzatore Landmark (Synthetic Data Generator)**: Per evitare di testare agitando la vera mano davanti alla UI per CI/CD, costruisco un modulo `MockVisionProvider` che invia nel `processResults()` un array finto di Landmark JSON programmabili (es: mano che fa circle path, mano che fa pinch trigger, tremolio random aggiunto a x/y).
*   **Math Unit Tests**: Testing spietato di `Smoother` e `PinchDetector` iniettando float per testare gli scatti limite di Isteresi. Ad esempio assicurarsi che un tremolio da `0.041` a `0.039` non faccia spam del token isPinchOn se la soglia off è a `0.06`.

## 13. Limiti Attuali e Prossimi Step
*   **Multithreading Reale (Web Worker)**: Adesso la classe invoca *HandLandmarker* nello stesso thread. Sebbene usi WASM in WebGL veloce, potrebbe rubare 5-10ms e abbattere leggermente le animazioni CSS in device legacy. **Step Avanti:** Spostare `SalvagenteCore` (o la sua parte ML) all'interno di un file `.worker.ts` e comunicare tramite `postMessage`. Passare lo stream camera tramite `OffscreenCanvas` per zero-main-thread-block.
*   **Agnostico 3D Z-Depth**: `CursorState` attuale non passa lo "zoom" (la distanza della mano dalla cam). MediaPipe `Z` valuta la depth relativa alla root del polso, ma il volume globale necessita di una euristica basata sull'area occupata dai landmark per capire la scale (mano vicina o mano lontana = cursore grosso o piccolo).
*   **Dual Hand Setup**: MVP usa `numHands: 1`. Futuro tratterà un `Map<handId, CursorState>` per supportare vere gesture simmetriche fra due player o due mani senza confondere gli ID del ML layer.

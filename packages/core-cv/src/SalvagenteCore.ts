import { HandLandmarker, FilesetResolver, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { EventEmitter } from "./utils/EventEmitter.js";
import { Smoother } from "./math/smoothing.js";
import { PinchDetector } from "./gestures/pinch.js";
import { CursorState, CoreEventMap, MultiHandFrame, MultiRawHand } from "@salvagente/shared-types";

export class SalvagenteCore extends EventEmitter<CoreEventMap> {
  private landmarker: HandLandmarker | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private isRunning = false;
  private lastVideoTime = -1;

  // Slot 0 — retrocompatibilità mono-mano per la shell / catalogo
  private pointerSmoother = new Smoother(0.25);
  private pinchDetector = new PinchDetector(0.04, 0.08);

  private missFrameCount = 0;
  private readonly MAX_MISS_FRAMES = 15;
  private currentState: CursorState = {
    position: { x: 0.5, y: 0.5 },
    isPinching: false,
    isHandPresent: false,
    activeGesture: 'idle',
    extendedFingersCount: 0,
  };

  async start(video: HTMLVideoElement) {
    this.videoEl = video;

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    this.landmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 8, // ← supporto fino a 8 mani
    });

    this.isRunning = true;
    requestAnimationFrame(this.visionLoop);
  }

  private visionLoop = () => {
    if (!this.isRunning || !this.videoEl || !this.landmarker) return;

    const timeNow = performance.now();

    if (this.videoEl.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = this.videoEl.currentTime;
      const results = this.landmarker.detectForVideo(this.videoEl, timeNow);
      this.processResults(results, timeNow);
    }

    requestAnimationFrame(this.visionLoop);
  };

  private processResults(results: HandLandmarkerResult, timestamp: number) {
    const hasHands = results.landmarks && results.landmarks.length > 0;

    // ── Evento multi-hand (nuovo) ──────────────────────────────────────────
    // Emesso ogni frame, anche con 0 mani (permette decay nel MultiHandTracker).
    const multiFrame: MultiHandFrame = {
      timestamp,
      hands: hasHands
        ? results.landmarks.map((landmarks, i): MultiRawHand => ({
            landmarks: landmarks as any,
            handedness:
              (results.handednesses[i]?.[0]?.categoryName as 'Left' | 'Right') ??
              'Unknown',
            confidence: results.handednesses[i]?.[0]?.score ?? 0,
          }))
        : [],
    };
    this.emit('multiHandUpdate', multiFrame);

    // ── Retrocompatibilità mono-mano (shell / catalogo) ────────────────────
    if (hasHands) {
      const hand = results.landmarks[0];
      const indexTip = hand[8];
      const thumbTip = hand[4];

      if (!this.currentState.isHandPresent) {
        this.pointerSmoother.reset(indexTip.x, indexTip.y);
        this.currentState.isHandPresent = true;
        this.emit('handDetected');
      }
      this.missFrameCount = 0;

      const smoothedPos = this.pointerSmoother.next(indexTip.x, indexTip.y);
      const isPinch = this.pinchDetector.update(thumbTip, indexTip);

      this.currentState = {
        ...this.currentState,
        position: smoothedPos,
        isPinching: isPinch,
        activeGesture: isPinch ? 'pinch' : 'open_palm',
      };

      this.emit('stateChange', this.currentState);
      this.emit('skeletonUpdate', {
        landmarks: hand as any,
        handedness: results.handednesses[0][0].categoryName as 'Left' | 'Right',
        score: results.handednesses[0][0].score,
      });
    } else {
      this.missFrameCount++;
      if (this.missFrameCount > this.MAX_MISS_FRAMES && this.currentState.isHandPresent) {
        this.currentState.isHandPresent = false;
        this.currentState.isPinching = false;

        this.emit('stateChange', this.currentState);
        this.emit('handLost', this.missFrameCount * 16.6);
      }
    }
  }

  stop() {
    this.isRunning = false;
    this.landmarker?.close();
  }
}

export interface Point2D { x: number; y: number; }
export interface Point3D extends Pick<Point2D, 'x' | 'y'> { z: number; }

export type GestureType = 'idle' | 'pinch' | 'open_palm' | 'closed_fist';

export interface CursorState {
  position: Point2D; 
  isPinching: boolean;
  isHandPresent: boolean;
  activeGesture: GestureType;
  extendedFingersCount: number;
}

export interface RawSkeleton {
  landmarks: Point3D[];
  handedness: 'Left' | 'Right';
  score: number;
}

export interface CoreEventMap {
  'stateChange': (state: CursorState) => void;
  'skeletonUpdate': (skeleton: RawSkeleton) => void;
  'handLost': (timeSinceLossMs: number) => void;
  'handDetected': () => void;
  'error': (err: Error) => void;
}

export interface AppManifest {
  id: string;
  title: string;
  shortDescription: string;
  interaction: {
    experienceType: 'contemplativa' | 'attiva' | 'esplorativa';
    primaryGesture: 'pointer' | 'pinch' | 'skeleton_full';
    gestureLabel: string;
  };
  presentation: {
    bubbleAssetUrl: string;
    backgroundColor: string;
    visibilityStatus: 'published' | 'draft' | 'hidden';
    sortWeight: number;
  };
  capabilities: {
    requiresVideoBackground: boolean;
    readyForRecording: boolean;
  };
}

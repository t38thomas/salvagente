// ── AppStateContext.tsx ──────────────────────────────────────
// Zustand store globale della shell.
// Esporta hook useAppState + Provider wrapper.
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import type { AppState, AppPhase } from './AppState';
import { INITIAL_SLICE } from './AppState';

// ── Store factory ─────────────────────────────────────────────
type AppStore = ReturnType<typeof createAppStore>;

function createAppStore() {
  return createStore<AppState>()((set, get) => ({
    ...INITIAL_SLICE,

    setPhase: (phase: AppPhase) => set({ phase }),

    setHoveredBubble: (id) => {
      if (get().hoveredBubbleId === id) return;
      set({ hoveredBubbleId: id });
    },

    setFocusedBubble: (id) => {
      if (get().focusedBubbleId === id) return;
      const phase = get().phase;
      // Non sovrascrivere fasi critiche
      if (phase === 'confirming' || phase === 'transitioning' ||
          phase === 'in-app'     || phase === 'returning') return;
      set({
        focusedBubbleId: id,
        phase: id != null ? 'focused' : (get().isHandPresent ? 'browsing' : 'attract'),
      });
    },

    setActiveApp: (id) => set({ activeAppId: id }),

    setHandPresence: (v) => {
      set({ isHandPresent: v });
      if (!v) {
        const phase = get().phase;
        if (phase === 'attract' || phase === 'browsing' ||
            phase === 'hovered' || phase === 'focused') {
          set({ hoveredBubbleId: null, focusedBubbleId: null, phase: 'attract' });
        }
      } else {
        const phase = get().phase;
        if (phase === 'attract') set({ phase: 'browsing' });
      }
    },

    setPinching: (v) => {
      if (get().isPinching === v) return;
      set({ isPinching: v });
    },

    resetToAttract: () => {
      const { isHandPresent, isPinching } = get();
      set({
        ...INITIAL_SLICE,
        isHandPresent,
        isPinching,
        phase: isHandPresent ? 'browsing' : 'attract',
      });
    },
  }));
}

// ── Context ───────────────────────────────────────────────────
const AppStoreContext = createContext<AppStore | null>(null);

// ── Provider ──────────────────────────────────────────────────
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }
  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
}

// ── Hook principale ───────────────────────────────────────────
export function useAppState<T>(selector: (s: AppState) => T): T {
  const store = useContext(AppStoreContext);
  if (!store) throw new Error('useAppState must be used within AppStateProvider');
  return useStore(store, selector);
}

/** Accesso diretto allo store senza re-render (per bridge imperativo) */
export function useAppStoreApi() {
  const store = useContext(AppStoreContext);
  if (!store) throw new Error('useAppStoreApi must be used within AppStateProvider');
  return store;
}

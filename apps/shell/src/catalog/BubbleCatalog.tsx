// ── BubbleCatalog.tsx ────────────────────────────────────────
// Orchestratore del catalogo a bolle.
// - monta il BubbleField
// - calcola i layout via useBubbleLayout
// - riceve il pointerPosRef dal bridge CV
// - gestisce la transizione verso la mini-app
// ─────────────────────────────────────────────────────────────
import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MINI_APP_REGISTRY } from '../miniapps/registry';
import { useBubbleLayout } from './useBubbleLayout';
import { BubbleField } from './BubbleField';
import { useAppState, useAppStoreApi } from '../app/AppStateContext';

interface BubbleCatalogProps {
  pointerPosRef: React.RefObject<{ x: number; y: number }>;
}

export function BubbleCatalog({ pointerPosRef }: BubbleCatalogProps) {
  const storeApi = useAppStoreApi();
  const phase    = useAppState(s => s.phase);

  // Filtra solo le app pubblicate
  const manifests = MINI_APP_REGISTRY
    .filter(r => r.manifest.presentation.visibilityStatus === 'published')
    .map(r => r.manifest);

  const layouts = useBubbleLayout(manifests);

  // Visibilità del catalogo
  const isVisible = (
    phase === 'attract'  ||
    phase === 'browsing' ||
    phase === 'hovered'  ||
    phase === 'focused'  ||
    phase === 'confirming'
  );

  const handleAppOpen = useCallback((appId: string) => {
    const store = storeApi.getState();
    store.setPhase('transitioning');
    store.setActiveApp(appId);

    // Breve delay per l'animazione di uscita catalogo
    setTimeout(() => {
      store.setPhase('in-app');
    }, 600);
  }, [storeApi]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="catalog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <BubbleField
            manifests={manifests}
            layouts={layouts}
            pointerPosRef={pointerPosRef}
            onAppOpen={handleAppOpen}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

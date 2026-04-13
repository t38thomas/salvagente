import React from 'react';

export const CatalogHUD: React.FC<{ isPinching: boolean }> = ({ isPinching }) => {
  return (
    <div style={{ pointerEvents: 'none', position: 'fixed', top: 20, right: 20, color: 'white', background: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 }}>
      {isPinching ? 'Pinch Attivo' : 'Rilassato'}
    </div>
  );
};

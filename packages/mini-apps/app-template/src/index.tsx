import React from 'react';
import type { AppManifest } from '@salvagente/shared-types';

export const manifest: AppManifest = {
  id: 'template',
  title: 'Template App',
  shortDescription: 'Un modello di base per mini-app',
  interaction: {
    experienceType: 'contemplativa',
    primaryGesture: 'pointer',
    gestureLabel: 'Sfiora per entrare'
  },
  presentation: {
    bubbleAssetUrl: '',
    backgroundColor: '#333333',
    visibilityStatus: 'draft',
    sortWeight: 0
  },
  capabilities: {
    requiresVideoBackground: false,
    readyForRecording: false
  }
};

const TemplateApp: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#fff' }}>
      <h1>Template App Running</h1>
    </div>
  );
};

export default TemplateApp;

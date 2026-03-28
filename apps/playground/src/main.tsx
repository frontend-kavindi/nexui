import { NexuiButton } from '@nexui/core';
import '@nexui/themes/css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Missing #root element');
}

createRoot(rootEl).render(
  <StrictMode>
    <main style={{ display: 'grid', gap: '12px', padding: '24px', fontFamily: 'system-ui' }}>
      <h1 style={{ margin: 0 }}>NexUI Playground</h1>
      <NexuiButton variant="secondary">Secondary</NexuiButton>
      <NexuiButton variant="primary">Primary</NexuiButton>
    </main>
  </StrictMode>,
);

import '@testing-library/jest-dom/vitest';
import '@nexui/themes/css';
import { applyNexuiTheme } from '@nexui/themes';

applyNexuiTheme('light');

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
globalThis.ResizeObserver = ResizeObserverStub;

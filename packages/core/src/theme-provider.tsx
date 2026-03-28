import { applyNexuiTheme, type NexuiThemeMode } from '@nexui/themes';
import { useLayoutEffect, type ReactNode } from 'react';

export type NexuiThemeProviderProps = {
  theme: NexuiThemeMode;
  /** Scoped root; defaults to `document.documentElement`. */
  target?: HTMLElement;
  children: ReactNode;
};

/**
 * Syncs NexUI CSS variables by toggling `data-nexui-theme` on the target root.
 * Import `@nexui/themes/css` once at app entry.
 */
export function NexuiThemeProvider({ theme, target, children }: NexuiThemeProviderProps) {
  useLayoutEffect(() => {
    applyNexuiTheme(theme, target);
  }, [theme, target]);

  return children;
}

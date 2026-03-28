/**
 * Framework-agnostic theme switching for NexUI CSS variables.
 * Load `import '@nexui/themes/css'` once, then toggle `data-nexui-theme` on an ancestor.
 */

export const NEXUI_THEME_ATTR = 'data-nexui-theme';

export type NexuiThemeMode = 'light' | 'dark' | 'high-contrast' | 'custom';

/** Keys inside tokens.theme / Style Dictionary (camelCase). */
export type NexuiThemeDocumentKey = 'light' | 'dark' | 'highContrast' | 'custom';

const THEME_MODE_TO_DOC: Record<NexuiThemeMode, NexuiThemeDocumentKey> = {
  light: 'light',
  dark: 'dark',
  'high-contrast': 'highContrast',
  custom: 'custom',
};

export function themeModeToDocumentKey(mode: NexuiThemeMode): NexuiThemeDocumentKey {
  return THEME_MODE_TO_DOC[mode];
}

function resolveTarget(target: HTMLElement | undefined): HTMLElement | undefined {
  if (target !== undefined) return target;
  if (typeof document === 'undefined') return undefined;
  return document.documentElement;
}

/**
 * Applies a theme by setting `data-nexui-theme` on `target` (default: `document.documentElement`).
 * Light theme clears the attribute so `:root` defaults apply.
 */
export function applyNexuiTheme(mode: NexuiThemeMode, target?: HTMLElement): void {
  const el = resolveTarget(target);
  if (!el) return;
  if (mode === 'light') {
    el.removeAttribute(NEXUI_THEME_ATTR);
    return;
  }
  el.setAttribute(NEXUI_THEME_ATTR, mode);
}

/** Returns the active theme mode, or `light` when the attribute is absent (default). */
export function readNexuiTheme(target?: HTMLElement): NexuiThemeMode {
  const el = resolveTarget(target);
  if (!el) return 'light';
  const raw = el.getAttribute(NEXUI_THEME_ATTR);
  if (raw === 'dark' || raw === 'high-contrast' || raw === 'custom') {
    return raw;
  }
  return 'light';
}

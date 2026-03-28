import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { tokens } from './index';
import { NEXUI_THEME_ATTR, applyNexuiTheme, readNexuiTheme } from './theme-runtime';

describe('@nexui/themes tokens', () => {
  it('exposes four themes with primary scales', () => {
    expect(tokens.theme.light.color.primary['500']).toMatch(/^#/);
    expect(tokens.theme.dark.color.primary['500']).toMatch(/^#/);
    expect(tokens.theme.highContrast.color.primary['500']).toMatch(/^#/);
    expect(tokens.theme.custom.color.primary['500']).toBe(tokens.theme.light.color.primary['500']);
  });

  it('uses a 4px spacing grid with 20 steps', () => {
    expect(tokens.theme.light.spacing['1']).toBe('4px');
    expect(tokens.theme.light.spacing['20']).toBe('80px');
  });

  it('defines shadow and motion tokens', () => {
    expect(tokens.theme.light.shadow.md.length).toBeGreaterThan(2);
    expect(tokens.theme.light.motion.duration.normal).toBe('200ms');
    expect(tokens.theme.light.motion.easing.spring).toContain('cubic-bezier');
  });

  it('defines mobile-first breakpoints', () => {
    expect(tokens.theme.light.breakpoint.sm).toBe('40rem');
  });

  it('exposes typography sizes xs through 4xl', () => {
    expect(tokens.theme.light.typography.fontSize.xs).toBe('0.75rem');
    expect(tokens.theme.light.typography.fontSize['4xl']).toBe('2.25rem');
  });
});

describe('@nexui/themes CSS artifact', () => {
  it('emits no physical directional longhands in nexui-variables.css after build', () => {
    const cssPath = path.join(process.cwd(), 'dist', 'nexui-variables.css');
    if (!fs.existsSync(cssPath)) {
      return;
    }
    const css = fs.readFileSync(cssPath, 'utf8');
    expect(css).not.toMatch(/margin-left|margin-right|padding-left|padding-right|border-left|border-right/);
    expect(css).toContain(NEXUI_THEME_ATTR);
    expect(css).toContain('padding-inline:');
    expect(css).toContain('--nexui-color-primary-500');
  });
});

describe('@nexui/themes runtime', () => {
  it('applies and reads theme attributes in jsdom', () => {
    const el = document.createElement('div');
    applyNexuiTheme('dark', el);
    expect(el.getAttribute(NEXUI_THEME_ATTR)).toBe('dark');
    expect(readNexuiTheme(el)).toBe('dark');
    applyNexuiTheme('light', el);
    expect(el.hasAttribute(NEXUI_THEME_ATTR)).toBe(false);
    expect(readNexuiTheme(el)).toBe('light');
  });
});

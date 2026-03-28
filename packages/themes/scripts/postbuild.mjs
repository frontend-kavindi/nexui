import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.join(__dirname, '..');
const srcDir = path.join(pkgRoot, 'src');
const distDir = path.join(pkgRoot, 'dist');
const sourceJson = path.join(srcDir, 'tokens.style-dictionary.json');
const distJson = path.join(distDir, 'tokens.style-dictionary.json');
const distCss = path.join(distDir, 'nexui-variables.css');

/** @param {string} segment */
function toKebab(segment) {
  return segment
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/** @param {unknown} value */
function isTokenLeaf(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    'value' in value &&
    typeof /** @type {{ value?: unknown }} */ (value).value === 'string'
  );
}

/**
 * @param {unknown} node
 * @param {string} prefix
 * @returns {string[]}
 */
function collectCssVars(node, prefix) {
  /** @type {string[]} */
  const lines = [];
  if (node === null || typeof node !== 'object' || Array.isArray(node)) {
    return lines;
  }

  for (const [key, val] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    const segment = toKebab(key);
    const next = prefix.length > 0 ? `${prefix}-${segment}` : segment;

    if (isTokenLeaf(val)) {
      const v = /** @type {{ value: string }} */ (val).value;
      lines.push(`  --nexui-${next}: ${v};`);
    } else {
      lines.push(...collectCssVars(val, next));
    }
  }

  return lines;
}

/** @param {string} cssBlock */
function stripPhysicalDirections(cssBlock) {
  const forbidden = [
    'margin-left',
    'margin-right',
    'padding-left',
    'padding-right',
    'border-left',
    'border-right',
  ];
  for (const needle of forbidden) {
    if (cssBlock.includes(needle)) {
      throw new Error(`nexui-variables.css must not use physical directional properties (found "${needle}")`);
    }
  }
}

const THEME_RULES = [
  { selectors: ':root, [data-nexui-theme="light"]', key: 'light' },
  { selectors: '[data-nexui-theme="dark"]', key: 'dark' },
  { selectors: '[data-nexui-theme="high-contrast"]', key: 'highContrast' },
  { selectors: '[data-nexui-theme="custom"]', key: 'custom' },
];

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const doc = JSON.parse(fs.readFileSync(sourceJson, 'utf8'));
const themes = doc.nexui.theme;

/** @type {string[]} */
const parts = [];

parts.push(`/**
 * NexUI — generated design tokens (CSS custom properties).
 * Themes: light (default on :root), dark, high-contrast, custom.
 * Spacing tokens are axis-neutral lengths — pair with margin-inline/padding-inline/inset-inline.
 * Default theme: light. Switch with data-nexui-theme on an ancestor (typically document.documentElement).
 */`);
parts.push('');

for (const { key, selectors } of THEME_RULES) {
  const tree = themes[key];
  if (!tree) {
    throw new Error(`Missing theme "${key}"`);
  }
  const body = collectCssVars(tree, '').join('\n');
  parts.push(`${selectors} {`);
  parts.push(body);
  parts.push('}');
  parts.push('');
}

parts.push(`/**
 * Logical layout helpers — use logical longhands (e.g. margin-inline*) only.
 * Prefer these patterns in NexUI components for correct RTL/LTR without [dir="rtl"] overrides.
 */`);
parts.push(`:where(.nexui-theme-provider) {`);
parts.push(`  box-sizing: border-box;`);
parts.push(`}`);
parts.push(``);
parts.push(`:where(.nexui-inset-focus) {`);
parts.push(`  position: relative;`);
parts.push(`  inset-inline: 0;`);
parts.push(`  inset-block: 0;`);
parts.push(`}`);
parts.push(``);
parts.push(`:where(.nexui-surface-pad) {`);
parts.push(`  padding-inline: var(--nexui-spacing-4);`);
parts.push(`  padding-block: var(--nexui-spacing-4);`);
parts.push(`}`);
parts.push(``);
parts.push(`:where(.nexui-stack-inline) {`);
parts.push(`  display: flex;`);
parts.push(`  flex-direction: row;`);
parts.push(`  gap: var(--nexui-spacing-3);`);
parts.push(`  margin-inline: 0;`);
parts.push(`  padding-inline: 0;`);
parts.push(`}`);

const css = `${parts.join('\n')}\n`;
stripPhysicalDirections(css);
fs.writeFileSync(distCss, css, 'utf8');
fs.copyFileSync(sourceJson, distJson);

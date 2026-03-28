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
    const segment = key.replace(/([A-Z])/g, '-$1').toLowerCase();
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

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const tree = JSON.parse(fs.readFileSync(sourceJson, 'utf8'));
const body = collectCssVars(tree, '').join('\n');
const css = `/* Generated — NexUI design tokens as CSS custom properties */\n:root {\n${body}\n}\n`;

fs.writeFileSync(distCss, css, 'utf8');
fs.copyFileSync(sourceJson, distJson);

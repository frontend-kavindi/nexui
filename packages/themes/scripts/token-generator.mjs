/**
 * NexUI design tokens — single source for Style Dictionary JSON, TS, and CSS.
 * Leaves use Style Dictionary shape: { value, type }.
 */

/** @param {string} value @param {string} type */
function t(value, type) {
  return { value, type };
}

/** 10-step scale keys */
const SHADE_KEYS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

/** @type {Record<string, string>} */
const PRIMARY_LIGHT = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
};

/** @type {Record<string, string>} */
const PRIMARY_DARK = {
  50: '#1e3a5f',
  100: '#1e4070',
  200: '#1d4ebc',
  300: '#2563eb',
  400: '#3b82f6',
  500: '#60a5fa',
  600: '#93c5fd',
  700: '#bfdbfe',
  800: '#dbeafe',
  900: '#eff6ff',
};

/** @type {Record<string, string>} */
const SECONDARY_LIGHT = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7',
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
};

/** @type {Record<string, string>} */
const SECONDARY_DARK = {
  50: '#3b1f61',
  100: '#4c1d95',
  200: '#5b21b6',
  300: '#6d28d9',
  400: '#7c3aed',
  500: '#8b5cf6',
  600: '#a78bfa',
  700: '#c4b5fd',
  800: '#ddd6fe',
  900: '#ede9fe',
};

/** @type {Record<string, string>} */
const NEUTRAL_LIGHT = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
};

/** @type {Record<string, string>} */
const NEUTRAL_DARK = {
  50: '#18181b',
  100: '#27272a',
  200: '#3f3f46',
  300: '#52525b',
  400: '#71717a',
  500: '#a1a1aa',
  600: '#d4d4d8',
  700: '#e4e4e7',
  800: '#f4f4f5',
  900: '#fafafa',
};

/**
 * @param {Record<string, string>} scale
 * @returns {Record<string, {value: string, type: string}>}
 */
function colorSteps(scale) {
  /** @type {Record<string, {value: string, type: string}>} */
  const out = {};
  for (const k of SHADE_KEYS) {
    out[k] = t(scale[k], 'color');
  }
  return out;
}

function semanticLight() {
  return {
    success: {
      fg: t('#14532d', 'color'),
      bg: t('#dcfce7', 'color'),
      bgMuted: t('#f0fdf4', 'color'),
      border: t('#22c55e', 'color'),
    },
    warning: {
      fg: t('#713f12', 'color'),
      bg: t('#fef9c3', 'color'),
      bgMuted: t('#fffbeb', 'color'),
      border: t('#eab308', 'color'),
    },
    error: {
      fg: t('#7f1d1d', 'color'),
      bg: t('#fee2e2', 'color'),
      bgMuted: t('#fef2f2', 'color'),
      border: t('#ef4444', 'color'),
    },
    info: {
      fg: t('#1e3a8a', 'color'),
      bg: t('#dbeafe', 'color'),
      bgMuted: t('#eff6ff', 'color'),
      border: t('#3b82f6', 'color'),
    },
  };
}

function semanticDark() {
  return {
    success: {
      fg: t('#bbf7d0', 'color'),
      bg: t('#052e16', 'color'),
      bgMuted: t('#022c22', 'color'),
      border: t('#4ade80', 'color'),
    },
    warning: {
      fg: t('#fde047', 'color'),
      bg: t('#422006', 'color'),
      bgMuted: t('#451a03', 'color'),
      border: t('#facc15', 'color'),
    },
    error: {
      fg: t('#fecaca', 'color'),
      bg: t('#450a0a', 'color'),
      bgMuted: t('#1c1917', 'color'),
      border: t('#f87171', 'color'),
    },
    info: {
      fg: t('#bfdbfe', 'color'),
      bg: t('#172554', 'color'),
      bgMuted: t('#0f172a', 'color'),
      border: t('#60a5fa', 'color'),
    },
  };
}

/** WCAG AAA-friendly semantic */
function semanticHighContrast() {
  return {
    success: {
      fg: t('#00320a', 'color'),
      bg: t('#d6ffd6', 'color'),
      bgMuted: t('#eaffea', 'color'),
      border: t('#006600', 'color'),
    },
    warning: {
      fg: t('#3d2500', 'color'),
      bg: t('#fff2a8', 'color'),
      bgMuted: t('#fffce8', 'color'),
      border: t('#8a5b00', 'color'),
    },
    error: {
      fg: t('#4a0000', 'color'),
      bg: t('#ffd6d6', 'color'),
      bgMuted: t('#fff0f0', 'color'),
      border: t('#c00000', 'color'),
    },
    info: {
      fg: t('#001a4d', 'color'),
      bg: t('#cfe8ff', 'color'),
      bgMuted: t('#e8f4ff', 'color'),
      border: t('#0047ab', 'color'),
    },
  };
}

function surfaceTextBorderLight() {
  return {
    surface: {
      canvas: t('#ffffff', 'color'),
      raised: t('#fafafa', 'color'),
      overlay: t('#ffffff', 'color'),
      sunken: t('#f4f4f5', 'color'),
      inverse: t('#18181b', 'color'),
    },
    text: {
      primary: t('#18181b', 'color'),
      secondary: t('#52525b', 'color'),
      tertiary: t('#71717a', 'color'),
      disabled: t('#a1a1aa', 'color'),
      inverse: t('#fafafa', 'color'),
      onPrimary: t('#ffffff', 'color'),
      onSecondary: t('#ffffff', 'color'),
    },
    border: {
      default: t('#e4e4e7', 'color'),
      subtle: t('#f4f4f5', 'color'),
      strong: t('#d4d4d8', 'color'),
      focus: t('#2563eb', 'color'),
    },
    overlay: {
      scrim: t('rgb(0 0 0 / 0.45)', 'color'),
    },
  };
}

function surfaceTextBorderDark() {
  return {
    surface: {
      canvas: t('#09090b', 'color'),
      raised: t('#18181b', 'color'),
      overlay: t('#27272a', 'color'),
      sunken: t('#000000', 'color'),
      inverse: t('#fafafa', 'color'),
    },
    text: {
      primary: t('#fafafa', 'color'),
      secondary: t('#a1a1aa', 'color'),
      tertiary: t('#71717a', 'color'),
      disabled: t('#52525b', 'color'),
      inverse: t('#18181b', 'color'),
      onPrimary: t('#ffffff', 'color'),
      onSecondary: t('#ffffff', 'color'),
    },
    border: {
      default: t('#3f3f46', 'color'),
      subtle: t('#27272a', 'color'),
      strong: t('#52525b', 'color'),
      focus: t('#60a5fa', 'color'),
    },
    overlay: {
      scrim: t('rgb(0 0 0 / 0.65)', 'color'),
    },
  };
}

/** WCAG AAA contrast targets: near black/white, explicit borders */
function surfaceTextBorderHighContrast() {
  return {
    surface: {
      canvas: t('#000000', 'color'),
      raised: t('#0a0a0a', 'color'),
      overlay: t('#000000', 'color'),
      sunken: t('#000000', 'color'),
      inverse: t('#ffffff', 'color'),
    },
    text: {
      primary: t('#ffffff', 'color'),
      secondary: t('#f5f5f5', 'color'),
      tertiary: t('#e5e5e5', 'color'),
      disabled: t('#a3a3a3', 'color'),
      inverse: t('#000000', 'color'),
      onPrimary: t('#000000', 'color'),
      onSecondary: t('#000000', 'color'),
    },
    border: {
      default: t('#ffffff', 'color'),
      subtle: t('#d4d4d4', 'color'),
      strong: t('#ffffff', 'color'),
      focus: t('#ffff00', 'color'),
    },
    overlay: {
      scrim: t('rgb(0 0 0 / 0.85)', 'color'),
    },
  };
}

function typography() {
  return {
    fontFamily: {
      sans: t(
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        'fontFamily',
      ),
      mono: t('ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', 'fontFamily'),
      display: t('"Inter Variable", ui-sans-serif, system-ui, sans-serif', 'fontFamily'),
    },
    fontSize: {
      xs: t('0.75rem', 'fontSize'),
      sm: t('0.875rem', 'fontSize'),
      md: t('1rem', 'fontSize'),
      lg: t('1.125rem', 'fontSize'),
      xl: t('1.25rem', 'fontSize'),
      '2xl': t('1.5rem', 'fontSize'),
      '3xl': t('1.875rem', 'fontSize'),
      '4xl': t('2.25rem', 'fontSize'),
    },
    fontWeight: {
      regular: t('400', 'fontWeight'),
      medium: t('500', 'fontWeight'),
      semibold: t('600', 'fontWeight'),
      bold: t('700', 'fontWeight'),
    },
    lineHeight: {
      tight: t('1.2', 'lineHeight'),
      snug: t('1.35', 'lineHeight'),
      normal: t('1.5', 'lineHeight'),
      relaxed: t('1.625', 'lineHeight'),
      loose: t('1.75', 'lineHeight'),
    },
    letterSpacing: {
      tighter: t('-0.04em', 'letterSpacing'),
      tight: t('-0.02em', 'letterSpacing'),
      normal: t('0em', 'letterSpacing'),
      wide: t('0.02em', 'letterSpacing'),
      wider: t('0.05em', 'letterSpacing'),
    },
  };
}

function spacing() {
  /** @type {Record<string, {value: string, type: string}>} */
  const out = {};
  for (let step = 1; step <= 20; step += 1) {
    const px = step * 4;
    out[String(step)] = t(`${px}px`, 'dimension');
  }
  return out;
}

function shadowLight() {
  return {
    none: t('none', 'boxShadow'),
    sm: t('0 1px 2px 0 rgb(0 0 0 / 0.05)', 'boxShadow'),
    md: t('0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', 'boxShadow'),
    lg: t('0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', 'boxShadow'),
    xl: t('0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', 'boxShadow'),
  };
}

function shadowDark() {
  return {
    none: t('none', 'boxShadow'),
    sm: t('0 1px 2px 0 rgb(0 0 0 / 0.45)', 'boxShadow'),
    md: t('0 4px 6px -1px rgb(0 0 0 / 0.55), 0 2px 4px -2px rgb(0 0 0 / 0.45)', 'boxShadow'),
    lg: t('0 10px 15px -3px rgb(0 0 0 / 0.55), 0 4px 6px -4px rgb(0 0 0 / 0.45)', 'boxShadow'),
    xl: t('0 20px 25px -5px rgb(0 0 0 / 0.55), 0 8px 10px -6px rgb(0 0 0 / 0.45)', 'boxShadow'),
  };
}

function shadowHighContrast() {
  return {
    none: t('none', 'boxShadow'),
    sm: t('0 0 0 1px #ffffff', 'boxShadow'),
    md: t('0 0 0 2px #ffffff', 'boxShadow'),
    lg: t('0 0 0 3px #ffffff', 'boxShadow'),
    xl: t('0 0 0 4px #ffff00', 'boxShadow'),
  };
}

function radius() {
  return {
    none: t('0', 'borderRadius'),
    sm: t('0.125rem', 'borderRadius'),
    md: t('0.375rem', 'borderRadius'),
    lg: t('0.5rem', 'borderRadius'),
    xl: t('0.75rem', 'borderRadius'),
    full: t('9999px', 'borderRadius'),
  };
}

function motion() {
  return {
    duration: {
      fast: t('120ms', 'duration'),
      normal: t('200ms', 'duration'),
      slow: t('320ms', 'duration'),
      toastDismissFast: t('3200ms', 'duration'),
      toastDismissNormal: t('4800ms', 'duration'),
      toastDismissSlow: t('6400ms', 'duration'),
    },
    easing: {
      easeIn: t('cubic-bezier(0.4, 0, 1, 1)', 'cubicBezier'),
      easeOut: t('cubic-bezier(0, 0, 0.2, 1)', 'cubicBezier'),
      easeInOut: t('cubic-bezier(0.4, 0, 0.2, 1)', 'cubicBezier'),
      spring: t('cubic-bezier(0.34, 1.56, 0.64, 1)', 'cubicBezier'),
    },
  };
}

function breakpoints() {
  return {
    xs: t('30rem', 'dimension'),
    sm: t('40rem', 'dimension'),
    md: t('48rem', 'dimension'),
    lg: t('64rem', 'dimension'),
    xl: t('80rem', 'dimension'),
    '2xl': t('96rem', 'dimension'),
  };
}

function zIndex() {
  return {
    base: t('0', 'dimension'),
    dropdown: t('1000', 'dimension'),
    sticky: t('1100', 'dimension'),
    modalBackdrop: t('1200', 'dimension'),
    modal: t('1300', 'dimension'),
    toast: t('1400', 'dimension'),
  };
}

function opacityTokens() {
  return {
    transparent: t('0', 'opacity'),
    subdued: t('0.6', 'opacity'),
    full: t('1', 'opacity'),
  };
}

/**
 * @param {{
 *  primary: Record<string, string>,
 *  secondary: Record<string, string>,
 *  neutral: Record<string, string>,
 *  semantic: object,
 *  surfacePack: object,
 *  shadow: object,
 * }} p
 */
function buildThemeTokens(p) {
  return {
    color: {
      primary: colorSteps(p.primary),
      secondary: colorSteps(p.secondary),
      neutral: colorSteps(p.neutral),
      semantic: p.semantic,
      ...p.surfacePack,
    },
    typography: typography(),
    spacing: spacing(),
    shadow: p.shadow,
    radius: radius(),
    motion: motion(),
    breakpoint: breakpoints(),
    zIndex: zIndex(),
    opacity: opacityTokens(),
  };
}

export function buildStyleDictionaryDocument() {
  const light = buildThemeTokens({
    primary: PRIMARY_LIGHT,
    secondary: SECONDARY_LIGHT,
    neutral: NEUTRAL_LIGHT,
    semantic: semanticLight(),
    surfacePack: surfaceTextBorderLight(),
    shadow: shadowLight(),
  });

  const dark = buildThemeTokens({
    primary: PRIMARY_DARK,
    secondary: SECONDARY_DARK,
    neutral: NEUTRAL_DARK,
    semantic: semanticDark(),
    surfacePack: surfaceTextBorderDark(),
    shadow: shadowDark(),
  });

  const highContrast = buildThemeTokens({
    primary: {
      50: '#e8f2ff',
      100: '#cfe4ff',
      200: '#9bc7ff',
      300: '#5ba3ff',
      400: '#1a7fff',
      500: '#0066ff',
      600: '#004ecc',
      700: '#003899',
      800: '#002266',
      900: '#001133',
    },
    secondary: {
      50: '#f5e8ff',
      100: '#e8cfff',
      200: '#cfa0ff',
      300: '#b066ff',
      400: '#902aff',
      500: '#7000e0',
      600: '#5600b0',
      700: '#3d0080',
      800: '#280055',
      900: '#140033',
    },
    neutral: {
      50: '#ffffff',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#000000',
    },
    semantic: semanticHighContrast(),
    surfacePack: surfaceTextBorderHighContrast(),
    shadow: shadowHighContrast(),
  });

  /** Custom: baseline identical to light — replace in brand pipeline / Figma sync */
  const custom = JSON.parse(JSON.stringify(light));

  return {
    nexui: {
      $description: 'NexUI tokens — Style Dictionary compatible leaves { value, type }',
      theme: {
        light: {
          $description: 'Default light theme',
          ...light,
        },
        dark: {
          $description: 'Dark theme',
          ...dark,
        },
        highContrast: {
          $description: 'WCAG AAA-oriented high contrast',
          ...highContrast,
        },
        custom: {
          $description: 'Brand extension baseline — duplicate of light; replace in CI or Figma',
          ...custom,
        },
      },
    },
  };
}

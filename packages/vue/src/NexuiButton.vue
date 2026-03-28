<script setup lang="ts">
/**
 * Accessible button / link-styled control.
 *
 * ARIA / WCAG 2.1 AA:
 * - Native `<button>` supplies role, focus, and keyboard activation (4.1.2 Name, Role, Value) without custom widgets.
 * - `aria-busy="true"` while loading tells assistive tech the control is pending (4.1.3); pair with live regions in app chrome when copy changes.
 * - Disabling while loading blocks double submission and redundant entry (3.3.7-style error prevention).
 * - Icon-only buttons must still get a name via slot text or host `aria-label` / `aria-labelledby` (2.4.6).
 *
 * Keyboard:
 * - Enter / Space: activate (native button).
 * - Tab / Shift+Tab: document order only.
 */
import { classNames } from '@nexui/utils';
import { computed, ref, useAttrs, type CSSProperties } from 'vue';

export type NexuiButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type NexuiButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    variant?: NexuiButtonVariant;
    size?: NexuiButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    rootClass?: string;
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    loading: false,
    fullWidth: false,
  },
);

const attrs = useAttrs();

const rootRef = ref<HTMLButtonElement | null>(null);

defineExpose({
  /** Underlying native `<button>` for imperative focus/measurement. */
  el: rootRef,
  focus: (options?: FocusOptions) => {
    rootRef.value?.focus(options);
  },
  blur: () => {
    rootRef.value?.blur();
  },
});

const SPINNER_DIM: Record<NexuiButtonSize, string> = {
  xs: 'var(--nexui-spacing-3)',
  sm: 'var(--nexui-spacing-4)',
  md: 'var(--nexui-spacing-4)',
  lg: 'var(--nexui-spacing-5)',
  xl: 'var(--nexui-spacing-6)',
};

const SIZE_PADDING: Record<
  NexuiButtonSize,
  Record<'paddingBlock' | 'paddingInline' | 'fontSize' | 'lineHeight' | 'gap', string>
> = {
  xs: {
    paddingBlock: 'var(--nexui-spacing-1)',
    paddingInline: 'var(--nexui-spacing-2)',
    fontSize: 'var(--nexui-typography-font-size-xs)',
    lineHeight: 'var(--nexui-typography-line-height-snug)',
    gap: 'var(--nexui-spacing-1)',
  },
  sm: {
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-3)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
    lineHeight: 'var(--nexui-typography-line-height-snug)',
    gap: 'var(--nexui-spacing-1)',
  },
  md: {
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-4)',
    fontSize: 'var(--nexui-typography-font-size-md)',
    lineHeight: 'var(--nexui-typography-line-height-normal)',
    gap: 'var(--nexui-spacing-2)',
  },
  lg: {
    paddingBlock: 'var(--nexui-spacing-3)',
    paddingInline: 'var(--nexui-spacing-5)',
    fontSize: 'var(--nexui-typography-font-size-lg)',
    lineHeight: 'var(--nexui-typography-line-height-normal)',
    gap: 'var(--nexui-spacing-2)',
  },
  xl: {
    paddingBlock: 'var(--nexui-spacing-4)',
    paddingInline: 'var(--nexui-spacing-6)',
    fontSize: 'var(--nexui-typography-font-size-xl)',
    lineHeight: 'var(--nexui-typography-line-height-relaxed)',
    gap: 'var(--nexui-spacing-3)',
  },
};

function variantStyles(variant: NexuiButtonVariant, disabled: boolean): Record<string, string | undefined> {
  const base: Record<string, string | undefined> = {
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontWeight: 'var(--nexui-typography-font-weight-medium)',
    borderRadius: 'var(--nexui-radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderStyle: 'solid',
    borderWidth: '1px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: undefined,
    opacity: disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
  };

  switch (variant) {
    case 'primary':
      return {
        ...base,
        borderColor: 'var(--nexui-color-primary-600)',
        backgroundColor: 'var(--nexui-color-primary-600)',
        color: 'var(--nexui-color-text-on-primary)',
      };
    case 'secondary':
      return {
        ...base,
        borderColor: 'var(--nexui-color-border-default)',
        backgroundColor: 'var(--nexui-color-surface-canvas)',
        color: 'var(--nexui-color-text-primary)',
      };
    case 'ghost':
      return {
        ...base,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        color: 'var(--nexui-color-text-primary)',
      };
    case 'danger':
      return {
        ...base,
        borderColor: 'var(--nexui-color-semantic-error-border)',
        backgroundColor: 'var(--nexui-color-semantic-error-bg)',
        color: 'var(--nexui-color-semantic-error-fg)',
      };
    case 'link':
      return {
        ...base,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        color: 'var(--nexui-color-primary-600)',
        textDecoration: 'underline',
        textUnderlineOffset: 'var(--nexui-spacing-1)',
      };
    default: {
      const _never: never = variant;
      return _never;
    }
  }
}

const restAttrs = computed(() => {
  const r = { ...(attrs as Record<string, unknown>) };
  delete r.class;
  delete r.style;
  delete r.type;
  delete r.disabled;
  return r;
});

const isDisabled = computed(() => {
  const nativeDisabled = attrs.disabled === '' || attrs.disabled === true;
  return nativeDisabled || props.loading;
});

const mergedClass = computed(() => classNames('nexui-button', props.rootClass, attrs.class as string | undefined));

function normalizeCssValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((v) => (typeof v === 'number' ? String(v) : String(v))).join(' ');
  return undefined;
}

function mergeRecord(base: Record<string, string | undefined>): CSSProperties {
  const out: CSSProperties = { ...base };
  const st = attrs.style;
  if (typeof st === 'object' && st !== null && !Array.isArray(st)) {
    for (const [key, val] of Object.entries(st as Record<string, unknown>)) {
      const normalized = normalizeCssValue(val);
      if (normalized !== undefined) {
        (out as Record<string, string | undefined>)[key] = normalized;
      }
    }
  }
  return out;
}

const mergedStyle = computed((): CSSProperties => {
  const pad = SIZE_PADDING[props.size];
  const core = {
    ...variantStyles(props.variant, isDisabled.value),
    ...pad,
    flexDirection: 'row' as const,
    boxSizing: 'border-box' as const,
    width: props.fullWidth ? '100%' : undefined,
  };
  return mergeRecord(core);
});

const spinnerDim = computed(() => SPINNER_DIM[props.size]);

const buttonType = computed((): 'button' | 'submit' | 'reset' => {
  const t = attrs.type;
  if (t === 'submit' || t === 'reset' || t === 'button') return t;
  return 'button';
});

// DECISION LOG
// Problem: match React’s token-only inline maps without bringing CSS-in-JS or Tailwind into the Vue bundle.
// Options: (1) duplicate CSS modules per variant; (2) align with React by sharing only tokens; (3) extract shared TS style maps to a future `@nexui/styles` package.
// Why Vue differs: Vue favors slots for `icon-left` / `icon-right` instead of `ReactNode` props so consumers pass markup without `h()`.
// Trade-off: `inheritAttrs: false` is required to merge computed styles with user `style` safely.
</script>

<template>
  <button
    ref="rootRef"
    v-bind="restAttrs"
    :type="buttonType"
    :class="mergedClass"
    :style="mergedStyle"
    :disabled="isDisabled"
    :aria-busy="loading ? true : undefined"
  >
    <template v-if="loading">
      <svg
        aria-hidden="true"
        focusable="false"
        :style="{
          width: spinnerDim,
          height: spinnerDim,
          flexShrink: 0,
          animation: 'nexui-spin var(--nexui-motion-duration-slow) linear infinite',
          transformOrigin: 'center',
        }"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          stroke-width="var(--nexui-spacing-1)"
          stroke-dasharray="50"
          stroke-linecap="round"
          :style="{ opacity: 'var(--nexui-opacity-subdued)' }"
        />
      </svg>
    </template>
    <slot v-else name="icon-left" />
    <slot />
    <slot v-if="!loading" name="icon-right" />
  </button>
</template>

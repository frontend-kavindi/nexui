<script setup lang="ts">
/**
 * Toggle using explicit `switch` semantics (not a native checkbox).
 *
 * ARIA / WCAG 2.1 AA:
 * - `role="switch"` signals on/off semantics distinct from tri-state checkboxes (4.1.2).
 * - `aria-checked` mirrors boolean state (4.1.2).
 * - Visible label is referenced with `aria-labelledby` (3.3.2 / 4.1.2).
 * - Native `disabled` + `aria-disabled` for redundancy when inert (2.1.1).
 *
 * Keyboard:
 * - Space / Enter toggle (`preventDefault` on Space to avoid page scroll).
 */
import { classNames } from '@nexui/utils';
import { computed, ref, useId } from 'vue';

const model = defineModel<boolean>({ default: false });

const props = withDefaults(
  defineProps<{
    label: string;
    disabled?: boolean;
    rootClass?: string;
    id?: string;
  }>(),
  { disabled: false },
);

const uid = useId();
const labelId = `${uid}-label`;
const controlId = computed(() => props.id ?? `nexui-switch-${uid}`);

const rootRef = ref<HTMLButtonElement | null>(null);

defineExpose({
  rootRef,
  focus: (options?: FocusOptions) => rootRef.value?.focus(options),
});

const row: Record<string, string> = {
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'var(--nexui-spacing-3)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-primary)',
};

const trackBase: Record<string, string> = {
  position: 'relative',
  width: 'var(--nexui-spacing-10)',
  height: 'var(--nexui-spacing-5)',
  borderRadius: 'var(--nexui-radius-full)',
  borderWidth: '1px',
  borderStyle: 'solid',
  flexShrink: '0',
  transitionProperty: 'background-color, border-color',
  transitionDuration: 'var(--nexui-motion-duration-normal)',
  transitionTimingFunction: 'var(--nexui-motion-easing-ease-out)',
};

const thumbBase: Record<string, string> = {
  position: 'absolute',
  top: 'var(--nexui-spacing-1)',
  left: 'var(--nexui-spacing-1)',
  width: 'var(--nexui-spacing-3)',
  height: 'var(--nexui-spacing-3)',
  borderRadius: 'var(--nexui-radius-full)',
  backgroundColor: 'var(--nexui-color-surface-canvas)',
  boxShadow: 'var(--nexui-shadow-sm)',
  transitionProperty: 'transform',
  transitionDuration: 'var(--nexui-motion-duration-normal)',
  transitionTimingFunction: 'var(--nexui-motion-easing-spring)',
};

const wrap = computed(() => ({
  ...row,
  opacity: props.disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
}));

const trackStyle = computed(() => ({
  ...trackBase,
  borderColor: model.value ? 'var(--nexui-color-primary-600)' : 'var(--nexui-color-border-default)',
  backgroundColor: model.value ? 'var(--nexui-color-primary-600)' : 'var(--nexui-color-surface-sunken)',
}));

const thumbStyle = computed(() => ({
  ...thumbBase,
  transform: model.value ? 'translateX(var(--nexui-spacing-5))' : 'translateX(0)',
}));

const buttonStyle = computed(
  (): Record<string, string | number> => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
  }),
);

function toggle(): void {
  if (props.disabled) return;
  model.value = !model.value;
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    toggle();
  }
}

// DECISION LOG
// Problem: Vue forms often misuse checkbox for switches; we keep parity with React’s `role="switch"` button.
// Options: native checkbox styled; `button` + APG switch pattern.
// Why: Button + switch role avoids incorrect implicit checkbox semantics in SRs.
// Trade-off: not submitted in forms without hidden field wiring — same as React.
</script>

<template>
  <div :class="classNames('nexui-switch', rootClass)" :style="wrap">
    <button
      :id="controlId"
      ref="rootRef"
      type="button"
      role="switch"
      :aria-checked="model"
      :aria-labelledby="labelId"
      :aria-disabled="disabled ? true : undefined"
      :disabled="disabled"
      :style="buttonStyle"
      @click="toggle"
      @keydown="onKeyDown"
    >
      <span :style="trackStyle" aria-hidden="true">
        <span :style="thumbStyle" />
      </span>
    </button>
    <span :id="labelId">{{ label }}</span>
  </div>
</template>

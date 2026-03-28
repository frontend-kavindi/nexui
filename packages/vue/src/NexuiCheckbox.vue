<script setup lang="ts">
/**
 * Checkbox with visible label and optional indeterminate state.
 *
 * ARIA / WCAG 2.1 AA:
 * - Native `<input type="checkbox">` exposes correct role/state (4.1.2).
 * - `<label for>` + `id` pairs copy with control (3.3.2).
 * - `disabled` removes from tab order and is exposed to AT (2.1.1).
 * - Indeterminate is applied only via the DOM property (no duplicate `aria-checked="mixed"` on the native control).
 *
 * Keyboard:
 * - Space toggles when focused (native).
 */
import { classNames } from '@nexui/utils';
import { computed, ref, useId, watchEffect } from 'vue';

const model = defineModel<boolean>({ default: false });

const props = withDefaults(
  defineProps<{
    label: string;
    indeterminate?: boolean;
    disabled?: boolean;
    rootClass?: string;
    value?: string;
    name?: string;
    id?: string;
  }>(),
  {
    indeterminate: false,
    disabled: false,
  },
);

const uid = useId();
const id = computed(() => props.id ?? `nexui-checkbox-${uid}`);

const inputRef = ref<HTMLInputElement | null>(null);

defineExpose({
  inputRef,
  focus: (options?: FocusOptions) => inputRef.value?.focus(options),
});

watchEffect(() => {
  const el = inputRef.value;
  if (el) {
    el.indeterminate = props.indeterminate;
  }
});

const row: Record<string, string> = {
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 'var(--nexui-spacing-2)',
  cursor: 'pointer',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-primary)',
};

const labelStyle = computed(() => ({
  ...row,
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  opacity: props.disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
}));

const inputStyle: Record<string, string> = {
  width: 'var(--nexui-spacing-4)',
  height: 'var(--nexui-spacing-4)',
  margin: '0',
  marginTop: 'var(--nexui-spacing-1)',
  flexShrink: '0',
  accentColor: 'var(--nexui-color-primary-600)',
  cursor: 'inherit',
};

function onChange(e: Event): void {
  const t = e.target as HTMLInputElement;
  model.value = t.checked;
}

// DECISION LOG
// Problem: React spreads arbitrary input props; Vue SFC needs explicit fields unless `useAttrs` passthrough is added.
// Options: thin wrapper with `$attrs` on `<input>` vs explicit prop list.
// Why: explicit `name`/`value` keeps forms predictable; extend with `$attrs` later if parity demands it.
// Trade-off: `v-model` replaces `checked` + `@change` boilerplate from React.
</script>

<template>
  <label :for="id" :class="classNames('nexui-checkbox', rootClass)" :style="labelStyle">
    <input
      :id="id"
      ref="inputRef"
      type="checkbox"
      class="nexui-checkbox-input"
      :style="inputStyle"
      :disabled="disabled"
      :checked="model"
      :name="name"
      :value="value"
      @change="onChange"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
/**
 * Single radio option bound to `NexuiRadioGroup`’s `v-model`.
 *
 * ARIA / WCAG 2.1 AA:
 * - Native `type="radio"` maps role/state (4.1.2).
 * - Label association via `for`/`id` (3.3.2).
 * - `checked` derives from group model so state is deterministic (4.1.2).
 */
import { classNames } from '@nexui/utils';
import { computed, inject, ref, useId } from 'vue';
import { nexuiRadioGroupKey } from './radioInjection';

const ctx = inject(nexuiRadioGroupKey);
if (!ctx) {
  throw new Error('NexuiRadio must be used within NexuiRadioGroup');
}

const props = withDefaults(
  defineProps<{
    label: string;
    value: string;
    disabled?: boolean;
    rootClass?: string;
    id?: string;
  }>(),
  { disabled: false },
);

const uid = useId();
const inputId = computed(() => props.id ?? `nexui-radio-opt-${uid}`);

const disabled = computed(() => props.disabled || ctx.disabled.value);
const checked = computed(() => ctx.model.value === props.value);

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
  cursor: disabled.value ? 'not-allowed' : 'pointer',
  opacity: disabled.value ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
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

const groupName = computed(() => ctx.name.value);

const inputRef = ref<HTMLInputElement | null>(null);

defineExpose({
  inputRef,
  focus: (options?: FocusOptions) => inputRef.value?.focus(options),
});

function onChange(): void {
  if (ctx) {
    ctx.setModel(props.value);
  }
}

// DECISION LOG
// Problem: radios cannot be used standalone safely without shared `name` + value wiring.
// Options: implicit array collection; explicit `provide`/`inject`.
// Why: mirrors React context ergonomics and keeps native grouping intact.
// Trade-off: throws if used outside the group — same failure mode as React’s `useRadioGroup` hook would be.
</script>

<template>
  <label :for="inputId" :class="classNames('nexui-radio', rootClass)" :style="labelStyle">
    <input
      :id="inputId"
      ref="inputRef"
      type="radio"
      class="nexui-radio-input"
      :style="inputStyle"
      :name="groupName"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      @change="onChange"
    />
    <span>{{ label }}</span>
  </label>
</template>

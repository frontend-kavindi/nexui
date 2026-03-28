<script setup lang="ts">
/**
 * Radio group with one shared selection model.
 *
 * ARIA / WCAG 2.1 AA:
 * - `role="radiogroup"` annotates the grouping boundary (1.3.1).
 * - Optional legend id feeds `aria-labelledby` for the group name (4.1.2).
 * - `aria-disabled` mirrors the group inert state (2.1.1).
 *
 * Keyboard:
 * - Native grouped radios keep browser arrow-key behavior where supported.
 */
import { classNames } from '@nexui/utils';
import { computed, provide, toRef, useId } from 'vue';
import { nexuiRadioGroupKey } from './radioInjection';

const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    label?: string;
    name?: string;
    disabled?: boolean;
    rootClass?: string;
  }>(),
  { disabled: false },
);

const uid = useId();
const legendId = `${uid}-legend`;
const name = computed(() => props.name ?? `nexui-radio-${uid}`);

provide(nexuiRadioGroupKey, {
  name,
  model,
  setModel: (v: string) => {
    model.value = v;
  },
  disabled: toRef(props, 'disabled'),
});

const labelledBy = computed(() => (props.label ? legendId : undefined));

const legendStyle: Record<string, string> = {
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  fontWeight: 'var(--nexui-typography-font-weight-medium)',
  color: 'var(--nexui-color-text-primary)',
  padding: '0',
  marginBottom: 'var(--nexui-spacing-2)',
};

const groupStack: Record<string, string> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-2)',
};

// DECISION LOG
// Problem: React uses Context; Vue uses `provide`/`inject` with explicit group shell.
// Options: implicit grouping via `name` only; fieldset wrapper + provide API.
// Why: fieldset + radiogroup role matches APG grouping guidance and mirrors React’s `NexuiRadioGroup`.
// Trade-off: `v-model` binds the selected value string; React used `value` + `onValueChange`.
</script>

<template>
  <fieldset
    :class="classNames('nexui-radio-group', rootClass)"
    style="border: none; margin: 0; padding: 0; min-width: 0"
    role="radiogroup"
    :aria-labelledby="labelledBy"
    :aria-disabled="disabled ? true : undefined"
  >
    <legend v-if="label" :id="legendId" :style="legendStyle">
      {{ label }}
    </legend>
    <div :style="groupStack">
      <slot />
    </div>
  </fieldset>
</template>

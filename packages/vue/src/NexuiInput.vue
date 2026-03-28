<script setup lang="ts">
/**
 * Text field with label, helper, validation chrome, password visibility, counter, and clear.
 *
 * ARIA / WCAG 2.1 AA:
 * - `<label for>` + stable `id` pairs label with control (3.3.2 Labels or Instructions).
 * - `aria-invalid` surfaces validation state (3.3.1 Error Identification).
 * - `aria-describedby` wires helper, error, and counter (4.1.2 Name, Role, Value).
 * - Password visibility control uses `aria-pressed` and explicit accessible name (2.4.6).
 * - Error paragraph uses `role="alert"` for immediate announcement (4.1.3 Status Messages).
 *
 * Keyboard:
 * - Native text input; Tab reaches trailing buttons; buttons activate with Space/Enter.
 */
import { classNames } from '@nexui/utils';
import { computed, ref, useAttrs, useId } from 'vue';

defineOptions({ inheritAttrs: false });

const model = defineModel<string>({ default: '' });

const props = withDefaults(
  defineProps<{
    label?: string;
    helperText?: string;
    error?: boolean;
    errorMessage?: string;
    success?: boolean;
    showPasswordToggle?: boolean;
    maxLength?: number;
    clearable?: boolean;
    disabled?: boolean;
    containerClass?: string;
    inputClass?: string;
    inputId?: string;
    type?: string;
    name?: string;
    placeholder?: string;
    autocomplete?: string;
  }>(),
  {
    error: false,
    errorMessage: 'This field has an error.',
    success: false,
    showPasswordToggle: false,
    clearable: false,
    disabled: false,
    type: 'text',
  },
);

const emit = defineEmits<{
  clear: [];
}>();

const attrs = useAttrs();

const uid = useId();
const id = computed(() => props.inputId ?? `nexui-input-${uid}`);
const helperId = computed(() => `${id.value}-helper`);
const errorId = computed(() => `${id.value}-error`);
const counterId = computed(() => `${id.value}-counter`);

const reveal = ref(false);
const focused = ref(false);

const inputRef = ref<HTMLInputElement | null>(null);

defineExpose({
  inputRef,
  focus: (options?: FocusOptions) => inputRef.value?.focus(options),
  blur: () => inputRef.value?.blur(),
});

const passthroughAttrs = computed(() => {
  const r = { ...(attrs as Record<string, unknown>) };
  delete r.class;
  delete r.style;
  return r;
});

const effectiveType = computed(() => {
  if (props.type === 'password' && props.showPasswordToggle && reveal.value) return 'text';
  if (props.type === 'password' && props.showPasswordToggle) return 'password';
  return props.type;
});

const showSuccess = computed(() => props.success && !props.error);

const describedBy = computed(() => {
  const parts: string[] = [];
  if (props.helperText) parts.push(helperId.value);
  if (props.error) parts.push(errorId.value);
  if (props.maxLength !== undefined) parts.push(counterId.value);
  return parts.length > 0 ? parts.join(' ') : undefined;
});

function mergeFieldChrome(): Record<string, string> {
  const base: Record<string, string> = {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: 'var(--nexui-radius-md)',
    backgroundColor: 'var(--nexui-color-surface-canvas)',
  };
  if (props.error) {
    return {
      ...base,
      borderColor: 'var(--nexui-color-semantic-error-border)',
      boxShadow: '0 0 0 1px var(--nexui-color-semantic-error-border)',
    };
  }
  if (showSuccess.value) {
    return {
      ...base,
      borderColor: 'var(--nexui-color-semantic-success-border)',
      boxShadow: '0 0 0 1px var(--nexui-color-semantic-success-border)',
    };
  }
  if (focused.value) {
    return {
      ...base,
      borderColor: 'var(--nexui-color-border-focus)',
      boxShadow: '0 0 0 2px var(--nexui-color-border-focus)',
    };
  }
  return {
    ...base,
    borderColor: 'var(--nexui-color-border-default)',
    boxShadow: 'none',
  };
}

type Css = Record<string, string>;

const shell: Css = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-2)',
  width: '100%',
};

const labelStyle: Css = {
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  fontWeight: 'var(--nexui-typography-font-weight-medium)',
  color: 'var(--nexui-color-text-primary)',
};

const wrap = computed((): Css => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  ...mergeFieldChrome(),
  overflow: 'hidden',
}));

const inputStyle: Css = {
  flex: '1 1 auto',
  minWidth: '0',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-md)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-primary)',
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-3)',
};

const affixBtn = computed((): Css => ({
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-2)',
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--nexui-color-text-secondary)',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  alignSelf: 'center',
}));

const suffixRail: Css = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'var(--nexui-spacing-1)',
  paddingInlineEnd: 'var(--nexui-spacing-2)',
};

const helperStyle: Css = {
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-secondary)',
};

const counterStyle: Css = {
  ...helperStyle,
  color: 'var(--nexui-color-text-tertiary)',
  textAlign: 'end',
};

const currentLength = computed(() => model.value.length);

function onInput(e: Event): void {
  const t = e.target as HTMLInputElement;
  model.value = t.value;
}

function clear(): void {
  model.value = '';
  emit('clear');
}

// DECISION LOG
// Problem: mirror React’s single-focus-ring wrapper while supporting `v-model` ergonomics.
// Options: (1) split into atomic presentational pieces; (2) match React feature set in one SFC.
// Why Vue differs: `defineModel` replaces `value` + `onChange`; clear uses `emit('clear')` for parity with React `onClear` callback pattern.
// Trade-off: consumers pass `disabled`/`name`/`placeholder` as props instead of rest-spread like React — see PROP-API-DIFFERENCES.md.
</script>

<template>
  <div :class="classNames('nexui-input-field', containerClass)" :style="shell">
    <label v-if="label" :for="id" :style="labelStyle">{{ label }}</label>
    <div :style="wrap">
      <input
        :id="id"
        ref="inputRef"
        v-bind="passthroughAttrs"
        :class="classNames('nexui-input', inputClass)"
        :style="inputStyle"
        :type="effectiveType"
        :disabled="disabled"
        :value="model"
        :maxlength="maxLength"
        :name="name"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="describedBy"
        @input="onInput"
        @focus="focused = true"
        @blur="focused = false"
      />
      <div :style="suffixRail">
        <button
          v-if="clearable && !disabled && currentLength > 0"
          type="button"
          :style="affixBtn"
          aria-label="Clear value"
          @click="clear"
        >
          ×
        </button>
        <button
          v-if="type === 'password' && showPasswordToggle"
          type="button"
          :style="affixBtn"
          :aria-pressed="reveal"
          :aria-label="reveal ? 'Hide password' : 'Show password'"
          :disabled="disabled"
          @click="reveal = !reveal"
        >
          {{ reveal ? 'Hide' : 'Show' }}
        </button>
      </div>
    </div>
    <p v-if="helperText" :id="helperId" :style="helperStyle">{{ helperText }}</p>
    <p
      v-if="error"
      :id="errorId"
      role="alert"
      :style="{ ...helperStyle, color: 'var(--nexui-color-semantic-error-fg)' }"
    >
      {{ errorMessage }}
    </p>
    <p v-if="maxLength !== undefined" :id="counterId" :style="counterStyle" aria-live="polite">
      {{ currentLength }} / {{ maxLength }}
    </p>
  </div>
</template>

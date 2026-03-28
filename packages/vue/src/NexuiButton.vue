<script setup lang="ts">
import { classNames } from '@nexui/utils';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    rootClass?: string;
  }>(),
  { variant: 'secondary', disabled: false },
);

const buttonClass = computed(() => classNames('nexui-button', props.rootClass));

const buttonStyle = computed(() => ({
  borderRadius: 'var(--nexui-radius-md)',
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-4)',
  border:
    props.variant === 'primary'
      ? '1px solid var(--nexui-color-primary-600)'
      : '1px solid var(--nexui-color-border-default)',
  background:
    props.variant === 'primary'
      ? 'var(--nexui-color-primary-600)'
      : 'var(--nexui-color-surface-canvas)',
  color:
    props.variant === 'primary'
      ? 'var(--nexui-color-text-on-primary)'
      : 'var(--nexui-color-text-primary)',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
}));
</script>

<template>
  <button type="button" :class="buttonClass" :style="buttonStyle" :disabled="disabled">
    <slot />
  </button>
</template>

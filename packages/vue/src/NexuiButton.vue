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
  borderRadius: 'var(--nexui-radius-md, 8px)',
  padding: 'var(--nexui-space-2, 8px) var(--nexui-space-4, 16px)',
  border:
    props.variant === 'primary'
      ? '1px solid var(--nexui-color-brand-primary, #2563eb)'
      : '1px solid var(--nexui-color-border-default, #e5e5e5)',
  background:
    props.variant === 'primary'
      ? 'var(--nexui-color-brand-primary, #2563eb)'
      : 'var(--nexui-color-background-canvas, #ffffff)',
  color:
    props.variant === 'primary'
      ? 'var(--nexui-color-brand-onPrimary, #ffffff)'
      : 'var(--nexui-color-foreground-default, #0a0a0a)',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
}));
</script>

<template>
  <button type="button" :class="buttonClass" :style="buttonStyle" :disabled="disabled">
    <slot />
  </button>
</template>

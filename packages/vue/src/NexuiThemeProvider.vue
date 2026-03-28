<script setup lang="ts">
import { applyNexuiTheme, type NexuiThemeMode } from '@nexui/themes';
import { onMounted, watch } from 'vue';

const props = defineProps<{
  theme: NexuiThemeMode;
  target?: HTMLElement;
}>();

function sync(): void {
  applyNexuiTheme(props.theme, props.target);
}

onMounted(sync);
watch(
  () => [props.theme, props.target] as const,
  () => {
    sync();
  },
);
</script>

<template>
  <slot />
</template>

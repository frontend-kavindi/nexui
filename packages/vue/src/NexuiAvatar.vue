<script setup lang="ts">
/**
 * Circular avatar frame with optional image and textual fallback.
 *
 * ARIA / WCAG 2.1 AA:
 * - When `src` loads, `alt` describes the subject (1.1.1).
 * - When only fallback shows, wrapper `role="img"` + `aria-label` names the entity (1.1.1).
 * - Decorative frames stay non-focusable (2.1.1).
 *
 * Keyboard:
 * - Non-interactive; no keyboard operations.
 */
import { classNames } from '@nexui/utils';
import { computed, ref, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

export type NexuiAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const props = withDefaults(
  defineProps<{
    /** Image URL; when missing or broken, `fallback` shows. */
    src?: string;
    alt?: string;
    fallback: string;
    size?: NexuiAvatarSize;
    rootClass?: string;
    ariaLabel?: string;
  }>(),
  {
    alt: '',
    size: 'md',
  },
);

const attrs = useAttrs();

const restImgAttrs = computed(() => {
  const r = { ...(attrs as Record<string, unknown>) };
  delete r.class;
  delete r.style;
  return r;
});

const failed = ref(false);

const showImg = computed(() => Boolean(props.src) && !failed.value);

const imgLabel = computed(() => props.ariaLabel ?? props.fallback);

const DIM: Record<NexuiAvatarSize, string> = {
  sm: 'var(--nexui-spacing-8)',
  md: 'var(--nexui-spacing-10)',
  lg: 'var(--nexui-spacing-12)',
  xl: 'var(--nexui-spacing-16)',
};

const FONT: Record<NexuiAvatarSize, string> = {
  sm: 'var(--nexui-typography-font-size-xs)',
  md: 'var(--nexui-typography-font-size-sm)',
  lg: 'var(--nexui-typography-font-size-md)',
  xl: 'var(--nexui-typography-font-size-lg)',
};

const shell = computed(
  (): Record<string, string> => ({
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: DIM[props.size],
    height: DIM[props.size],
    borderRadius: 'var(--nexui-radius-full)',
    overflow: 'hidden',
    flexShrink: '0',
    backgroundColor: 'var(--nexui-color-surface-sunken)',
    color: 'var(--nexui-color-text-secondary)',
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: FONT[props.size],
    fontWeight: 'var(--nexui-typography-font-weight-semibold)',
    lineHeight: 'var(--nexui-typography-line-height-tight)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--nexui-color-border-default)',
    ...(typeof attrs.style === 'object' && attrs.style !== null && !Array.isArray(attrs.style)
      ? (attrs.style as Record<string, string>)
      : {}),
  }),
);

const imgFill: Record<string, string> = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const rootRef = ref<HTMLDivElement | null>(null);

defineExpose({
  rootRef,
});

function onError(): void {
  failed.value = true;
}

// DECISION LOG
// Problem: Vue needs the same `alt` + fallback naming contract as React without relying on framework-specific image components.
// Options: always `<img>`; `background-image`; Nuxt `NuxtImg`.
// Why: straightforward `<img>` keeps the package agnostic while preserving failure handling.
// Trade-off: use `ariaLabel` prop instead of hyphenated `aria-label` in templates for ergonomic prop typing.
</script>

<template>
  <div
    ref="rootRef"
    :class="classNames('nexui-avatar', rootClass, attrs.class as string | undefined)"
    :style="shell"
    :role="showImg ? undefined : 'img'"
    :aria-label="showImg ? undefined : imgLabel"
  >
    <img
      v-if="showImg"
      :src="src"
      :alt="alt"
      :style="imgFill"
      v-bind="restImgAttrs"
      @error="onError"
    />
    <span v-else aria-hidden="true">{{ fallback }}</span>
  </div>
</template>

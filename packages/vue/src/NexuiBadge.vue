<script setup lang="ts">
/**
 * Compact status / count chip.
 *
 * ARIA / WCAG 2.1 AA:
 * - Default static text avoids noisy live-region chatter (4.1.3).
 * - `live` adds `role="status"` + `aria-live="polite"` for incremental values like unread counts (4.1.3).
 * - Palette uses semantic tokens for non-text contrast (1.4.11).
 *
 * Keyboard:
 * - Non-interactive; no keyboard operations.
 */
import { classNames } from '@nexui/utils';
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

export type NexuiBadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

const props = withDefaults(
  defineProps<{
    tone?: NexuiBadgeTone;
    live?: boolean;
    rootClass?: string;
  }>(),
  { tone: 'neutral', live: false },
);

const attrs = useAttrs();

const restAttrs = computed(() => {
  const r = { ...(attrs as Record<string, unknown>) };
  delete r.class;
  delete r.style;
  return r;
});

function toneSurface(tone: NexuiBadgeTone): { bg: string; fg: string; border: string } {
  switch (tone) {
    case 'primary':
      return {
        bg: 'var(--nexui-color-primary-100)',
        fg: 'var(--nexui-color-primary-800)',
        border: 'var(--nexui-color-primary-200)',
      };
    case 'success':
      return {
        bg: 'var(--nexui-color-semantic-success-bgMuted)',
        fg: 'var(--nexui-color-semantic-success-fg)',
        border: 'var(--nexui-color-semantic-success-border)',
      };
    case 'warning':
      return {
        bg: 'var(--nexui-color-semantic-warning-bgMuted)',
        fg: 'var(--nexui-color-semantic-warning-fg)',
        border: 'var(--nexui-color-semantic-warning-border)',
      };
    case 'error':
      return {
        bg: 'var(--nexui-color-semantic-error-bgMuted)',
        fg: 'var(--nexui-color-semantic-error-fg)',
        border: 'var(--nexui-color-semantic-error-border)',
      };
    case 'info':
      return {
        bg: 'var(--nexui-color-semantic-info-bgMuted)',
        fg: 'var(--nexui-color-semantic-info-fg)',
        border: 'var(--nexui-color-semantic-info-border)',
      };
    case 'neutral':
      return {
        bg: 'var(--nexui-color-surface-sunken)',
        fg: 'var(--nexui-color-text-secondary)',
        border: 'var(--nexui-color-border-default)',
      };
  }
}

const mergedStyle = computed(() => {
  const t = toneSurface(props.tone);
  const base: Record<string, string> = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'var(--nexui-spacing-5)',
    paddingBlock: 'var(--nexui-spacing-1)',
    paddingInline: 'var(--nexui-spacing-2)',
    borderRadius: 'var(--nexui-radius-full)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: t.border,
    backgroundColor: t.bg,
    color: t.fg,
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-xs)',
    fontWeight: 'var(--nexui-typography-font-weight-medium)',
    lineHeight: 'var(--nexui-typography-line-height-tight)',
  };
  const st = attrs.style;
  if (typeof st === 'object' && st !== null && !Array.isArray(st)) {
    return { ...base, ...(st as Record<string, string>) };
  }
  return base;
});

const mergedClass = computed(() => classNames('nexui-badge', props.rootClass, attrs.class as string | undefined));

// DECISION LOG
// Problem: live regions should be opt-in to match React and reduce SR noise.
// Options: always polite `status`; never live; prop-gated live.
// Why: aligns with React `live` default `false` and documents the WCAG intent in one place.
// Trade-off: consumers must set `live` when the badge value changes frequently.
</script>

<template>
  <span
    v-bind="restAttrs"
    :class="mergedClass"
    :style="mergedStyle"
    :role="live ? 'status' : undefined"
    :aria-live="live ? 'polite' : undefined"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
/**
 * Modal dialog with focus trap, scroll lock, backdrop, and motion hooks via CSS variables.
 *
 * ARIA / WCAG 2.1 AA:
 * - `role="dialog"` + `aria-modal="true"` identifies the modal window (4.1.2 Name, Role, Value).
 * - `aria-labelledby` references the visible title id so the window has an accessible name (4.1.2).
 * - Focus is constrained with `focus-trap` on the panel while `open` (2.4.3 Focus Order).
 * - Backdrop is a separate full-screen layer; optional click closes when `closeOnBackdropClick` is true.
 *
 * Keyboard:
 * - Tab / Shift+Tab cycle within the dialog while trapped.
 * - Escape closes via focus-trap `escapeDeactivates` → `update:open(false)`.
 */
import { createFocusTrap } from 'focus-trap';
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';

export type NexuiModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

const open = defineModel<boolean>('open', { default: false });

const props = withDefaults(
  defineProps<{
    size?: NexuiModalSize;
    closeOnBackdropClick?: boolean;
  }>(),
  {
    size: 'md',
    closeOnBackdropClick: true,
  },
);

const titleId = useId();

const panelRef = ref<HTMLDivElement | null>(null);

let trap: ReturnType<typeof createFocusTrap> | null = null;

defineExpose({
  panelRef,
});

const PANEL_WIDTH: Record<NexuiModalSize, Record<string, string | undefined>> = {
  sm: {
    width: 'min(calc(100% - var(--nexui-spacing-8)), var(--nexui-breakpoint-sm))',
    maxHeight: 'min(90vh, calc(100% - var(--nexui-spacing-10)))',
  },
  md: {
    width: 'min(calc(100% - var(--nexui-spacing-8)), var(--nexui-breakpoint-md))',
    maxHeight: 'min(90vh, calc(100% - var(--nexui-spacing-10)))',
  },
  lg: {
    width: 'min(calc(100% - var(--nexui-spacing-8)), var(--nexui-breakpoint-lg))',
    maxHeight: 'min(90vh, calc(100% - var(--nexui-spacing-10)))',
  },
  fullscreen: {
    width: 'calc(100% - var(--nexui-spacing-6))',
    height: 'calc(100% - var(--nexui-spacing-6))',
    maxHeight: 'none',
    borderRadius: 'var(--nexui-radius-none)',
  },
};

const backdropStyle: Record<string, string> = {
  position: 'fixed',
  inset: '0',
  zIndex: 'var(--nexui-z-index-modal-backdrop)',
  backgroundColor: 'var(--nexui-color-overlay-scrim)',
};

const layerStyle: Record<string, string> = {
  position: 'fixed',
  inset: '0',
  zIndex: 'var(--nexui-z-index-modal)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--nexui-spacing-6)',
  pointerEvents: 'none',
};

const panelBase: Record<string, string> = {
  pointerEvents: 'auto',
  backgroundColor: 'var(--nexui-color-surface-overlay)',
  color: 'var(--nexui-color-text-primary)',
  boxShadow: 'var(--nexui-shadow-xl)',
  borderRadius: 'var(--nexui-radius-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-4)',
  padding: 'var(--nexui-spacing-6)',
  overflow: 'auto',
};

function panelMotion(): Record<string, string> {
  return {
    animationName: 'nexui-modal-enter',
    animationDuration: 'var(--nexui-motion-duration-slow)',
    animationTimingFunction: 'var(--nexui-motion-easing-ease-out)',
    animationFillMode: 'forwards',
  };
}

const panelStyle = computed(() => ({
  ...panelBase,
  ...PANEL_WIDTH[props.size],
  ...panelMotion(),
}));

function syncTrap(): void {
  trap?.deactivate();
  trap = null;
  if (!open.value || !panelRef.value) return;
  trap = createFocusTrap(panelRef.value, {
    preventScroll: true,
    escapeDeactivates: true,
    clickOutsideDeactivates: props.closeOnBackdropClick,
    fallbackFocus: () => document.body,
    onDeactivate: () => {
      open.value = false;
    },
  });
  trap.activate();
}

watch(open, async (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    await nextTick();
    syncTrap();
  } else {
    trap?.deactivate();
    trap = null;
    document.body.style.overflow = '';
  }
});

function onBackdropMouseDown(e: MouseEvent): void {
  if (!props.closeOnBackdropClick) return;
  if (e.target === e.currentTarget) {
    open.value = false;
  }
}

onBeforeUnmount(() => {
  trap?.deactivate();
  document.body.style.overflow = '';
});

// DECISION LOG
// Problem: React uses `focus-trap-react`; Vue has no first-party twin in this repo.
// Options: (1) native `<dialog>`; (2) imperative `focus-trap`; (3) heavier headless UI kits.
// Why: `focus-trap` matches the React implementation’s dependency chain and behavior.
// Trade-off: exit animations from React are omitted here to avoid stale `rendered` state — add when the design system defines Vue keyframes contract.
</script>

<template>
  <Teleport to="body">
    <template v-if="open">
      <div :style="backdropStyle" @mousedown="onBackdropMouseDown" />
      <div :style="layerStyle">
        <div
          ref="panelRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          :style="panelStyle"
        >
          <header
            style="
              font-family: var(--nexui-typography-font-family-sans);
              font-size: var(--nexui-typography-font-size-xl);
              font-weight: var(--nexui-typography-font-weight-semibold);
            "
          >
            <h2
              :id="titleId"
              style="margin-block: 0; margin-inline: 0"
            >
              <slot name="title" />
            </h2>
          </header>
          <div style="flex: 1 1 auto">
            <slot />
          </div>
        </div>
      </div>
    </template>
  </Teleport>
</template>

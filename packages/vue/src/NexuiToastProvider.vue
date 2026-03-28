<script setup lang="ts">
/**
 * Hosts fixed toast regions portaled to `document.body`.
 *
 * ARIA / WCAG 2.1 AA:
 * - Each stack uses `aria-live="polite"` so announcements do not interrupt aggressively (4.1.3 Status Messages).
 * - `aria-relevant="additions text"` limits redundant chatter while new toasts still surface (4.1.3).
 * - Each toast is an `<article aria-labelledby>` pointing at the title heading (4.1.2).
 *
 * Keyboard:
 * - Tab reaches per-toast “Dismiss”; Enter/Space activate the native `<button>`.
 */
import { tokens } from '@nexui/themes';
import { computed, onBeforeUnmount, provide, ref } from 'vue';
import { nexuiToastInjectionKey } from './nexuiToastInjection';
import type {
  NexuiToastDurationPreset,
  NexuiToastInput,
  NexuiToastPosition,
  NexuiToastRecord,
  NexuiToastTone,
} from './toastTypes';

const toasts = ref<NexuiToastRecord[]>([]);
const timers = new Map<string, number>();

function createId(): string {
  return `nexui-toast-${Math.random().toString(36).slice(2)}`;
}

type ToastRegionPlacement = Partial<
  Record<'top' | 'bottom' | 'left' | 'right' | 'transform' | 'alignItems', string>
>;

const REGION: Record<NexuiToastPosition, ToastRegionPlacement> = {
  'top-left': {
    top: 'var(--nexui-spacing-4)',
    left: 'var(--nexui-spacing-4)',
    alignItems: 'flex-start',
  },
  'top-center': {
    top: 'var(--nexui-spacing-4)',
    left: '50%',
    transform: 'translateX(-50%)',
    alignItems: 'center',
  },
  'top-right': {
    top: 'var(--nexui-spacing-4)',
    right: 'var(--nexui-spacing-4)',
    alignItems: 'flex-end',
  },
  'bottom-left': {
    bottom: 'var(--nexui-spacing-4)',
    left: 'var(--nexui-spacing-4)',
    alignItems: 'flex-start',
  },
  'bottom-center': {
    bottom: 'var(--nexui-spacing-4)',
    left: '50%',
    transform: 'translateX(-50%)',
    alignItems: 'center',
  },
  'bottom-right': {
    bottom: 'var(--nexui-spacing-4)',
    right: 'var(--nexui-spacing-4)',
    alignItems: 'flex-end',
  },
};

const DURATION_VAR: Record<NexuiToastDurationPreset, string> = {
  fast: 'var(--nexui-motion-duration-toast-dismiss-fast)',
  normal: 'var(--nexui-motion-duration-toast-dismiss-normal)',
  slow: 'var(--nexui-motion-duration-toast-dismiss-slow)',
};

function toastDismissMs(preset: NexuiToastDurationPreset): number {
  const map = tokens.theme.light.motion.duration;
  const key =
    preset === 'fast'
      ? 'toastDismissFast'
      : preset === 'slow'
        ? 'toastDismissSlow'
        : 'toastDismissNormal';
  const raw = map[key];
  return Number.parseInt(raw.replace('ms', ''), 10);
}

function toneBorder(tone: NexuiToastTone): string {
  if (tone === 'success') return 'var(--nexui-color-semantic-success-border)';
  if (tone === 'error') return 'var(--nexui-color-semantic-error-border)';
  if (tone === 'warning') return 'var(--nexui-color-semantic-warning-border)';
  return 'var(--nexui-color-border-default)';
}

/**
 * Z-index strategy (matches React):
 * - Regions sit at `--nexui-z-index-toast` so notifications paint above modal layers while remaining token-governed.
 * - Within a region, DOM order determines stacking so dismissal animations stay predictable.
 */

function dismiss(id: string): void {
  const handle = timers.get(id);
  if (handle !== undefined) window.clearTimeout(handle);
  timers.delete(id);
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function push(toast: NexuiToastInput): string {
  const id = toast.id ?? createId();
  const record: NexuiToastRecord = {
    ...toast,
    id,
    position: toast.position ?? 'bottom-right',
    tone: toast.tone ?? 'default',
    duration: toast.duration ?? 'normal',
    createdAt: Date.now(),
  };
  toasts.value = [...toasts.value, record];
  const preset = record.duration ?? 'normal';
  const t = window.setTimeout(() => {
    dismiss(id);
  }, toastDismissMs(preset));
  timers.set(id, t);
  return id;
}

provide(nexuiToastInjectionKey, { toasts, push, dismiss });

onBeforeUnmount(() => {
  for (const h of timers.values()) {
    window.clearTimeout(h);
  }
  timers.clear();
});

const POSITION_ORDER: NexuiToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

const byPosition = computed((): Record<NexuiToastPosition, NexuiToastRecord[]> => {
  const b: Record<NexuiToastPosition, NexuiToastRecord[]> = {
    'top-left': [],
    'top-center': [],
    'top-right': [],
    'bottom-left': [],
    'bottom-center': [],
    'bottom-right': [],
  };
  for (const t of toasts.value) {
    b[t.position ?? 'bottom-right'].push(t);
  }
  return b;
});

const sectionShell: Record<string, string> = {
  position: 'fixed',
  zIndex: 'var(--nexui-z-index-toast)',
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'none',
  maxHeight: 'calc(100% - var(--nexui-spacing-8))',
  overflow: 'auto',
};

const cardShell: Record<string, string> = {
  pointerEvents: 'auto',
  minWidth: 'min(100%, var(--nexui-breakpoint-sm))',
  borderRadius: 'var(--nexui-radius-md)',
  borderWidth: '1px',
  borderStyle: 'solid',
  backgroundColor: 'var(--nexui-color-surface-overlay)',
  color: 'var(--nexui-color-text-primary)',
  boxShadow: 'var(--nexui-shadow-lg)',
  paddingInline: 'var(--nexui-spacing-4)',
  paddingBlock: 'var(--nexui-spacing-3)',
  marginBlockEnd: 'var(--nexui-spacing-2)',
};

// DECISION LOG
// Problem: Vue lacks React’s Context + `useReducer` ergonomics but needs the same six anchors and tokenized motion.
// Options: (1) Pinia store; (2) `provide`/`inject` with a `ref` queue; (3) event bus.
// Why: `provide`/`inject` mirrors React Context footprint for feature parity without global store ceremony.
// Trade-off: `push('id')` timers live in the provider instance — tests must wrap with the provider (same as React’s provider requirement).
</script>

<template>
  <div style="display: contents">
    <slot />
    <Teleport to="body">
      <template v-for="pos in POSITION_ORDER" :key="pos">
        <section
          v-if="byPosition[pos].length > 0"
          :style="{ ...sectionShell, ...REGION[pos] }"
          :aria-label="`Notifications ${pos}`"
          aria-live="polite"
          aria-relevant="additions text"
        >
          <article
            v-for="toast in byPosition[pos]"
            :key="toast.id"
            :aria-labelledby="`${toast.id}-title`"
            :style="{ ...cardShell, borderColor: toneBorder(toast.tone ?? 'default') }"
          >
            <h2
              :id="`${toast.id}-title`"
              style="
                font-family: var(--nexui-typography-font-family-sans);
                font-size: var(--nexui-typography-font-size-md);
                font-weight: var(--nexui-typography-font-weight-semibold);
                margin: 0;
              "
            >
              {{ toast.title }}
            </h2>
            <p
              v-if="toast.description"
              style="
                font-family: var(--nexui-typography-font-family-sans);
                font-size: var(--nexui-typography-font-size-sm);
                color: var(--nexui-color-text-secondary);
                margin: 0;
                margin-block-start: var(--nexui-spacing-1);
              "
            >
              {{ toast.description }}
            </p>
            <div style="margin-block-start: var(--nexui-spacing-2)" aria-hidden="true">
              <div
                style="
                  height: var(--nexui-spacing-1);
                  background-color: var(--nexui-color-surface-sunken);
                  border-radius: var(--nexui-radius-full);
                  overflow: hidden;
                "
              >
                <div
                  style="
                    height: 100%;
                    background-color: var(--nexui-color-primary-500);
                    transform-origin: left center;
                    animation-name: nexui-toast-progress;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                  "
                  :style="{
                    animationDuration: DURATION_VAR[toast.duration ?? 'normal'],
                  }"
                />
              </div>
            </div>
            <button
              type="button"
              style="
                margin-block-start: var(--nexui-spacing-2);
                font-size: var(--nexui-typography-font-size-sm);
                border: none;
                background: transparent;
                color: var(--nexui-color-text-secondary);
                cursor: pointer;
                padding: 0;
              "
              @click="dismiss(toast.id)"
            >
              Dismiss
            </button>
          </article>
        </section>
      </template>
    </Teleport>
  </div>
</template>

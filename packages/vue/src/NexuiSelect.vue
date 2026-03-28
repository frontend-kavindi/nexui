<script setup lang="ts">
/**
 * Custom listbox (not native `<select>`) for token styling, search, grouping, and multi-select.
 *
 * ARIA / WCAG 2.1 AA:
 * - Trigger is a `<button>` with `aria-haspopup="listbox"` and `aria-expanded` (4.1.2).
 * - Popover list uses `role="listbox"` + `role="option"` + `aria-selected` per APG (4.1.2).
 * - `aria-activedescendant` tracks highlighted option while focus stays in the filter field (4.1.2).
 * - Filter field uses `aria-label` when no external `<label>` is present (3.3.2).
 *
 * Keyboard:
 * - ArrowUp/Down/Home/End navigate; Enter commits; Space toggles multi; Escape closes.
 */
import { classNames } from '@nexui/utils';
import {
  computed,
  nextTick,
  ref,
  useId,
  watch,
} from 'vue';

export type NexuiSelectOption<V extends string = string> = {
  value: V;
  label: string;
  disabled?: boolean;
};

export type NexuiSelectGroup<V extends string = string> = {
  label: string;
  options: ReadonlyArray<NexuiSelectOption<V>>;
};

const model = defineModel<string | string[]>({ default: '' });

const props = withDefaults(
  defineProps<{
    options: ReadonlyArray<NexuiSelectOption | NexuiSelectGroup>;
    multiple?: boolean;
    placeholder?: string;
    disabled?: boolean;
    rootClass?: string;
    ariaLabel?: string;
  }>(),
  {
    multiple: false,
    placeholder: 'Select…',
    disabled: false,
  },
);

const rootId = useId();
const triggerId = `${rootId}-trigger`;
const listId = `${rootId}-listbox`;
const searchId = `${rootId}-search`;

const open = ref(false);
const query = ref('');
const highlight = ref(0);
const anchorRef = ref<HTMLButtonElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const coords = ref({ top: 0, left: 0, width: 0 });

defineExpose({
  anchorRef,
  searchRef,
});

function isGroup(entry: NexuiSelectOption | NexuiSelectGroup): entry is NexuiSelectGroup {
  return Array.isArray((entry as NexuiSelectGroup).options);
}

type FlatRow = { option: NexuiSelectOption; group?: string };

function flattenOptions(tree: ReadonlyArray<NexuiSelectOption | NexuiSelectGroup>): FlatRow[] {
  const rows: FlatRow[] = [];
  for (const entry of tree) {
    if (isGroup(entry)) {
      for (const option of entry.options) {
        rows.push({ option, group: entry.label });
      }
    } else {
      rows.push({ option: entry });
    }
  }
  return rows;
}

const flatAll = computed(() => flattenOptions(props.options));

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return flatAll.value;
  return flatAll.value.filter(({ option }) => option.label.toLowerCase().includes(q));
});

const selectedSingle = computed(() => {
  if (props.multiple) return '';
  const v = model.value;
  if (Array.isArray(v)) return v[0] ?? '';
  return typeof v === 'string' ? v : '';
});

const selectedMulti = computed(() => {
  if (!props.multiple) return [];
  const v = model.value;
  return Array.isArray(v) ? [...v] : [];
});

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    const el = anchorRef.value;
    if (el) {
      const r = el.getBoundingClientRect();
      coords.value = { top: r.bottom, left: r.left, width: r.width };
    }
    requestAnimationFrame(() => {
      searchRef.value?.focus();
    });
  }
});

watch(filtered, (list) => {
  if (highlight.value >= list.length) {
    highlight.value = Math.max(0, list.length - 1);
  }
});

const labelForValue = (v: string): string => {
  const hit = flatAll.value.find((r) => r.option.value === v);
  return hit?.option.label ?? v;
};

const display = computed(() => {
  if (props.multiple) {
    const arr = selectedMulti.value;
    if (arr.length === 0) return props.placeholder;
    if (arr.length === 1) return labelForValue(arr[0] ?? '');
    return `${String(arr.length)} selected`;
  }
  const v = selectedSingle.value;
  if (v === '') return props.placeholder;
  return labelForValue(v);
});

function commitSingle(v: string): void {
  model.value = v;
  open.value = false;
  query.value = '';
}

function toggleMulti(v: string): void {
  const current = [...selectedMulti.value];
  const idx = current.indexOf(v);
  const next = idx >= 0 ? current.filter((x) => x !== v) : [...current, v];
  model.value = next;
}

const activeId = computed(() => {
  const row = filtered.value[highlight.value];
  if (!row || row.option.disabled) return undefined;
  return `${listId}-opt-${String(highlight.value)}`;
});

const triggerStyle: Record<string, string> = {
  width: '100%',
  textAlign: 'start',
  cursor: 'pointer',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-md)',
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-3)',
  borderRadius: 'var(--nexui-radius-md)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
  backgroundColor: 'var(--nexui-color-surface-canvas)',
  color: 'var(--nexui-color-text-primary)',
  opacity: 'var(--nexui-opacity-full)',
};

const panelStyle = computed(
  (): Record<string, string | number> => ({
    position: 'fixed',
    top: coords.value.top,
    left: coords.value.left,
    minWidth: coords.value.width,
    zIndex: 'var(--nexui-z-index-dropdown)',
    backgroundColor: 'var(--nexui-color-surface-overlay)',
    borderRadius: 'var(--nexui-radius-md)',
    boxShadow: 'var(--nexui-shadow-lg)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--nexui-color-border-default)',
    maxHeight: 'var(--nexui-breakpoint-sm)',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--nexui-spacing-2)',
    padding: 'var(--nexui-spacing-2)',
    pointerEvents: 'auto',
  }),
);

const searchStyle: Record<string, string> = {
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-3)',
  borderRadius: 'var(--nexui-radius-sm)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
};

function optionStyle(active: boolean, disabledOpt: boolean): Record<string, string> {
  return {
    cursor: disabledOpt ? 'not-allowed' : 'pointer',
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-3)',
    borderRadius: 'var(--nexui-radius-sm)',
    backgroundColor: active ? 'var(--nexui-color-surface-sunken)' : 'transparent',
    color: disabledOpt ? 'var(--nexui-color-text-disabled)' : 'var(--nexui-color-text-primary)',
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
  };
}

function onTriggerKeyDown(e: KeyboardEvent): void {
  if (props.disabled) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!open.value) {
      open.value = true;
    } else if (e.key === 'ArrowDown') {
      highlight.value = Math.min(filtered.value.length - 1, highlight.value + 1);
    } else {
      highlight.value = Math.max(0, highlight.value - 1);
    }
  }
  if (e.key === 'Enter' || e.key === ' ') {
    if (!open.value) {
      e.preventDefault();
      open.value = true;
    }
  }
  if (e.key === 'Escape' && open.value) {
    e.preventDefault();
    open.value = false;
  }
}

function onListKeyDown(e: KeyboardEvent): void {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    highlight.value = Math.min(filtered.value.length - 1, highlight.value + 1);
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    highlight.value = Math.max(0, highlight.value - 1);
  }
  if (e.key === 'Home') {
    e.preventDefault();
    highlight.value = 0;
  }
  if (e.key === 'End') {
    e.preventDefault();
    highlight.value = Math.max(0, filtered.value.length - 1);
  }
  if (e.key === 'Enter') {
    const row = filtered.value[highlight.value];
    if (!row || row.option.disabled) return;
    e.preventDefault();
    if (props.multiple) toggleMulti(row.option.value);
    else commitSingle(row.option.value);
  }
  if (e.key === ' ') {
    const row = filtered.value[highlight.value];
    if (!row || row.option.disabled) return;
    e.preventDefault();
    if (props.multiple) toggleMulti(row.option.value);
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    open.value = false;
  }
}

const triggerStyleMerged = computed(() => ({
  ...triggerStyle,
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  opacity: props.disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
}));

function toggleOpen(): void {
  if (props.disabled) return;
  open.value = !open.value;
}

function onOptionClick(row: FlatRow): void {
  if (row.option.disabled) return;
  if (props.multiple) toggleMulti(row.option.value);
  else commitSingle(row.option.value);
}

// DECISION LOG
// Problem: native `<select>` cannot honor NexUI tokens or advanced list UX.
// Options: Headless UI Vue; in-house portal listbox (mirrors React).
// Why: dependency budget stays aligned with `@nexui/core` Select rationale.
// Trade-off: consumers must install the same motion/z-index tokens as React for perfect visual parity.
</script>

<template>
  <div :class="classNames('nexui-select', rootClass)">
    <button
      :id="triggerId"
      ref="anchorRef"
      type="button"
      :disabled="disabled"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listId"
      :aria-label="ariaLabel"
      :style="triggerStyleMerged"
      @click="toggleOpen"
      @keydown="onTriggerKeyDown"
    >
      {{ display }}
    </button>
    <Teleport to="body">
      <div
        v-if="open"
        role="presentation"
        tabindex="-1"
        :style="panelStyle"
        @keydown="onListKeyDown"
      >
          <input
            :id="searchId"
            ref="searchRef"
            v-model="query"
            aria-label="Filter options"
            :style="searchStyle"
            @input="highlight = 0"
          />
          <div
            :id="listId"
            role="listbox"
            :aria-labelledby="triggerId"
            :aria-multiselectable="multiple ? true : undefined"
            :aria-activedescendant="activeId"
          >
            <div
              v-for="(row, index) in filtered"
              :id="`${listId}-opt-${String(index)}`"
              :key="`${row.option.value}-${row.group ?? ''}`"
              role="option"
              :aria-selected="
                (!multiple && selectedSingle === row.option.value) ||
                (multiple && selectedMulti.includes(row.option.value))
                  ? true
                  : false
              "
              :aria-disabled="row.option.disabled ? true : undefined"
              :style="optionStyle(index === highlight, Boolean(row.option.disabled))"
              @mouseenter="highlight = index"
              @mousedown.prevent
              @click="onOptionClick(row)"
            >
              {{ row.group ? `${row.group} · ` : '' }}{{ row.option.label }}
            </div>
          </div>
      </div>
    </Teleport>
  </div>
</template>

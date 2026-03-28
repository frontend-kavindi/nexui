import { classNames } from '@nexui/utils';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';

/**
 * We intentionally avoid the native `<select>`:
 * - Styling and focus rings differ sharply across browsers, breaking NexUI's token-only contract.
 * - Native selects cannot host rich content (icons, descriptions), searchable filtering, or multi-value chips.
 * - `size`/`multiple` multi-select UX is poor for touch + screen-reader users compared to an ARIA listbox with explicit `aria-selected` patterns.
 * - Portaling + virtualized lists (future) are impossible inside native selects, yet required at enterprise data scale.
 * Trade-off: we must implement keyboard interaction ourselves (below) instead of relying on the UA listbox.
 */

/** Generic `value` allows branded string unions at call sites (`NexuiSelectOption<MyId>`). */
export type NexuiSelectOption<V extends string = string> = {
  value: V;
  label: string;
  disabled?: boolean;
};

export type NexuiSelectGroup<V extends string = string> = {
  label: string;
  options: ReadonlyArray<NexuiSelectOption<V>>;
};

export type NexuiSelectProps<V extends string = string> = {
  options: ReadonlyArray<NexuiSelectOption<V> | NexuiSelectGroup<V>>;
  multiple?: boolean;
  value?: V | ReadonlyArray<V>;
  defaultValue?: V | ReadonlyArray<V>;
  onChange?: (next: V | ReadonlyArray<V>) => void;
  placeholder?: string;
  'aria-label'?: string;
  disabled?: boolean;
  className?: string;
};

function isGroup<V extends string>(entry: NexuiSelectOption<V> | NexuiSelectGroup<V>): entry is NexuiSelectGroup<V> {
  return Array.isArray((entry as NexuiSelectGroup<V>).options);
}

type FlatRow<V extends string> = { option: NexuiSelectOption<V>; group?: string };

function flattenOptions<V extends string>(
  tree: ReadonlyArray<NexuiSelectOption<V> | NexuiSelectGroup<V>>,
): FlatRow<V>[] {
  const rows: FlatRow<V>[] = [];
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

/**
 * Accessible listbox replacement with filtering, multi-select, and grouping.
 *
 * ARIA / WCAG 2.1 AA:
 * - Trigger `button` exposes `aria-haspopup="listbox"` and `aria-expanded` (4.1.2).
 * - `role="listbox"` / `role="option"` / `aria-selected` mirror the APG listbox pattern (4.1.2).
 * - `aria-activedescendant` tracks the highlighted option for screen readers while roving focus stays on the menu container (4.1.2).
 * - Search field ships an `aria-label` when there is no dedicated `<label>` element (3.3.2).
 *
 * Keyboard:
 * - **ArrowDown / ArrowUp**: open the menu (if closed) or move the active option.
 * - **Enter / Space**: commit single-select or toggle multi-select on the active option.
 * - **Home / End**: jump to first/last visible option.
 * - **Escape**: closes the popover.
 */
export const NexuiSelect = forwardRef<HTMLButtonElement, NexuiSelectProps>(function NexuiSelect(
  {
    options,
    multiple = false,
    value,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    disabled,
    className,
    'aria-label': ariaLabel,
  },
  ref,
) {
  const rootId = useId();
  const triggerId = `${rootId}-trigger`;
  const listId = `${rootId}-listbox`;
  const searchId = `${rootId}-search`;
  const searchRef = useRef<HTMLInputElement>(null);
  const flatAll = useMemo(() => flattenOptions(options), [options]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const [uncontrolled, setUncontrolled] = useState<string | string[]>(() =>
    multiple ? ((Array.isArray(defaultValue) ? defaultValue : []) as string[]) : ((defaultValue ?? '') as string),
  );
  const anchorRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const isControlled = value !== undefined;
  const selected: string | string[] = isControlled ? (value as string | string[]) : uncontrolled;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flatAll;
    return flatAll.filter(({ option }) => option.label.toLowerCase().includes(q));
  }, [flatAll, query]);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setCoords({ top: r.bottom, left: r.left, width: r.width });
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (highlight >= filtered.length) setHighlight(Math.max(0, filtered.length - 1));
  }, [filtered.length, highlight]);

  const labelForValue = useCallback(
    (v: string) => flatAll.find((r) => r.option.value === v)?.option.label ?? v,
    [flatAll],
  );

  const display = useMemo(() => {
    if (multiple) {
      const arr = Array.isArray(selected) ? selected : [];
      if (arr.length === 0) return placeholder;
      if (arr.length === 1) return labelForValue(arr[0] ?? '');
      return `${String(arr.length)} selected`;
    }
    const v = selected as string;
    if (v === '') return placeholder;
    return labelForValue(v);
  }, [multiple, selected, labelForValue, placeholder]);

  const commitSingle = (v: string) => {
    if (!isControlled) setUncontrolled(v);
    onChange?.(v);
    setOpen(false);
    setQuery('');
  };

  const toggleMulti = (v: string) => {
    const current = Array.isArray(selected) ? [...selected] : [];
    const idx = current.indexOf(v);
    const next = idx >= 0 ? current.filter((x) => x !== v) : [...current, v];
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) setOpen(true);
      else if (e.key === 'ArrowDown')
        setHighlight((i) => Math.min(filtered.length - 1, i + 1));
      else setHighlight((i) => Math.max(0, i - 1));
    }
    if (e.key === 'Enter' || e.key === ' ') {
      if (!open) {
        e.preventDefault();
        setOpen(true);
      }
    }
    if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((i) => Math.min(filtered.length - 1, i + 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((i) => Math.max(0, i - 1));
    }
    if (e.key === 'Home') {
      e.preventDefault();
      setHighlight(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      setHighlight(Math.max(0, filtered.length - 1));
    }
    if (e.key === 'Enter') {
      const row = filtered[highlight];
      if (!row || row.option.disabled) return;
      e.preventDefault();
      if (multiple) toggleMulti(row.option.value);
      else commitSingle(row.option.value);
    }
    if (e.key === ' ') {
      const row = filtered[highlight];
      if (!row || row.option.disabled) return;
      e.preventDefault();
      if (multiple) toggleMulti(row.option.value);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  const activeId =
    filtered[highlight] && !filtered[highlight].option.disabled
      ? `${listId}-opt-${String(highlight)}`
      : undefined;

  const triggerStyle: CSSProperties = {
    width: '100%',
    textAlign: 'start',
    cursor: disabled ? 'not-allowed' : 'pointer',
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
    opacity: disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
  };

  const panelStyle: CSSProperties = {
    position: 'fixed',
    top: coords.top,
    left: coords.left,
    minWidth: coords.width,
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
  };

  const searchStyle: CSSProperties = {
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-3)',
    borderRadius: 'var(--nexui-radius-sm)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--nexui-color-border-default)',
  };

  const optionStyle = (active: boolean, disabledOpt: boolean): CSSProperties => ({
    cursor: disabledOpt ? 'not-allowed' : 'pointer',
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-3)',
    borderRadius: 'var(--nexui-radius-sm)',
    backgroundColor: active ? 'var(--nexui-color-surface-sunken)' : 'transparent',
    color: disabledOpt ? 'var(--nexui-color-text-disabled)' : 'var(--nexui-color-text-primary)',
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
  });

  return (
    <div className={classNames('nexui-select', className)}>
      <button
        id={triggerId}
        ref={(node) => {
          anchorRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        style={triggerStyle}
        onClick={() => {
          if (!disabled) setOpen((o) => !o);
        }}
        onKeyDown={onTriggerKeyDown}
      >
        {display}
      </button>
      {open
        ? createPortal(
            <div ref={panelRef} style={panelStyle} role="presentation" tabIndex={-1} onKeyDown={onListKeyDown}>
              <input
                id={searchId}
                ref={searchRef}
                aria-label="Filter options"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlight(0);
                }}
                style={searchStyle}
              />
              <div
                id={listId}
                role="listbox"
                aria-labelledby={triggerId}
                aria-multiselectable={multiple || undefined}
                aria-activedescendant={activeId}
              >
                {filtered.map(({ option, group }, index) => {
                  const selectedSingle = !multiple && selected === option.value;
                  const selectedMulti =
                    multiple && Array.isArray(selected) && selected.includes(option.value);
                  const isSelected = selectedSingle || selectedMulti;
                  const active = index === highlight;
                  return (
                    <div
                      key={`${option.value}-${group ?? ''}`}
                      id={`${listId}-opt-${String(index)}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled || undefined}
                      style={optionStyle(active, Boolean(option.disabled))}
                      onMouseEnter={() => { setHighlight(index); }}
                      onMouseDown={(e) => { e.preventDefault(); }}
                      onClick={() => {
                        if (option.disabled) return;
                        if (multiple) toggleMulti(option.value);
                        else commitSingle(option.value);
                      }}
                    >
                      {group ? `${group} · ` : ''}
                      {option.label}
                    </div>
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
});

NexuiSelect.displayName = 'NexuiSelect';

// DECISION LOG
// Problem: build a composable listbox that must support filtering, grouping, multi-select, and portal positioning without breaking SR focus.
// Options considered: (1) Headless UI / Radix dependency; (2) native `<select>` hacks; (3) minimal portal + `aria-activedescendant` model.
// Why I chose this: keeps @nexui/core dependency-light while still matching APG listbox guidance and design tokens.
// Trade-off: needs ResizeObserver + scroll listeners (future) to keep long menus aligned to the trigger.

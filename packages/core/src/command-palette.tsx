import { classNames } from '@nexui/utils';
import { FocusTrap } from 'focus-trap-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';

export type NexuiCommandPaletteItem = {
  id: string;
  label: string;
  onSelect: () => void;
};

export type NexuiCommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ReadonlyArray<NexuiCommandPaletteItem>;
  /** Placeholder for the filter field (3.3.2). */
  placeholder?: string;
  className?: string;
};

const backdrop: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 'var(--nexui-z-index-modalBackdrop)',
  backgroundColor: 'var(--nexui-color-overlay-scrim)',
};

const panel: CSSProperties = {
  position: 'fixed',
  zIndex: 'var(--nexui-z-index-modal)',
  top: 'var(--nexui-spacing-20)',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(100% - var(--nexui-spacing-8), var(--nexui-breakpoint-md))',
  borderRadius: 'var(--nexui-radius-lg)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
  backgroundColor: 'var(--nexui-color-surface-overlay)',
  boxShadow: 'var(--nexui-shadow-xl)',
  paddingBlock: 'var(--nexui-spacing-3)',
  paddingInline: 'var(--nexui-spacing-3)',
};

const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-3)',
  borderRadius: 'var(--nexui-radius-md)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-md)',
};

const listStyle: CSSProperties = {
  margin: 0,
  marginTop: 'var(--nexui-spacing-2)',
  padding: 0,
  listStyle: 'none',
  maxHeight: 'var(--nexui-breakpoint-sm)',
  overflowY: 'auto',
};

/**
 * Modal command surface with filterable listbox behavior.
 *
 * ARIA / WCAG 2.1 AA:
 * - `role="dialog"` + `aria-modal="true"` establishes a window for completion tasks (4.1.2).
 * - `aria-labelledby` points at the dialog title; `aria-describedby` references helper copy (4.1.2).
 * - Listbox pattern uses `role="listbox"` with `aria-activedescendant` on the combobox input for roving highlight (4.1.2).
 * - Escape closes the dialog (2.1.1).
 *
 * Keyboard:
 * - ArrowUp/ArrowDown moves active option; Enter activates; Escape closes.
 */
export const NexuiCommandPalette = forwardRef<HTMLDivElement, NexuiCommandPaletteProps>(
  function NexuiCommandPalette({ open, onOpenChange, items, placeholder = 'Type to filter…', className }, ref) {
    const titleId = useId();
    const descId = useId();
    const listId = useId();
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return [...items];
      return items.filter((i) => i.label.toLowerCase().includes(q));
    }, [items, query]);

    useEffect(() => {
      if (open) {
        setQuery('');
        setActive(0);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }, [open]);

    const close = useCallback(() => {
      onOpenChange(false);
    }, [onOpenChange]);

    const activate = useCallback(
      (index: number) => {
        const item = filtered[index];
        if (!item) return;
        item.onSelect();
        close();
      },
      [close, filtered],
    );

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i) => Math.min(filtered.length - 1, i + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        activate(active);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };

    if (!open) return null;

    const activeItem = filtered[active];
    const activeId = activeItem ? `${listId}-opt-${activeItem.id}` : undefined;

    return createPortal(
      <>
        <div style={backdrop} onMouseDown={close} aria-hidden />
        <FocusTrap
          focusTrapOptions={{
            preventScroll: true,
            escapeDeactivates: true,
            fallbackFocus: () => inputRef.current ?? document.body,
            onDeactivate: () => {
              close();
            },
          }}
        >
          <div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className={classNames('nexui-command-palette', className)}
            style={panel}
          >
            <h2 id={titleId} style={{ margin: 0, fontSize: 'var(--nexui-typography-font-size-md)' }}>
              Commands
            </h2>
            <p id={descId} style={{ margin: 0, marginTop: 'var(--nexui-spacing-1)', color: 'var(--nexui-color-text-secondary)' }}>
              Search and select an action.
            </p>
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-controls={listId}
              aria-expanded={true}
              aria-autocomplete="list"
              aria-activedescendant={activeId}
              aria-haspopup="listbox"
              value={query}
              placeholder={placeholder}
              style={{ ...inputStyle, marginTop: 'var(--nexui-spacing-3)' }}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
            <ul id={listId} role="listbox" aria-label="Commands" style={listStyle}>
              {filtered.map((item, index) => {
                const selected = index === active;
                return (
                  <li
                    key={item.id}
                    id={`${listId}-opt-${item.id}`}
                    role="option"
                    aria-selected={selected}
                    style={{
                      paddingBlock: 'var(--nexui-spacing-2)',
                      paddingInline: 'var(--nexui-spacing-3)',
                      borderRadius: 'var(--nexui-radius-sm)',
                      backgroundColor: selected ? 'var(--nexui-color-surface-sunken)' : 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'var(--nexui-typography-font-family-sans)',
                      fontSize: 'var(--nexui-typography-font-size-sm)',
                    }}
                    onMouseEnter={() => {
                      setActive(index);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => {
                      activate(index);
                    }}
                  >
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </FocusTrap>
      </>,
      document.body,
    );
  },
);

NexuiCommandPalette.displayName = 'NexuiCommandPalette';

// DECISION LOG
// Problem: power users need a fast command surface without shipping a full combobox library.
// Options considered: (1) Downshift; (2) CMDK package; (3) dialog + combobox + listbox roles.
// Why I chose this: focus-trap-react already ships with core for modal parity; listbox wiring stays explicit.
// Trade-off: no nested commands or grouping—extend with sections if product needs hierarchy.

import { classNames } from '@nexui/utils';
import {
  forwardRef,
  useCallback,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';

export type NexuiPaginationProps = {
  /** 1-based current page. */
  page: number;
  /** Total pages (>= 1). */
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
} & HTMLAttributes<HTMLElement>;

const navStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--nexui-spacing-2)',
};

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 'var(--nexui-spacing-1)',
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const btn: CSSProperties = {
  minWidth: 'var(--nexui-spacing-10)',
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-3)',
  borderRadius: 'var(--nexui-radius-md)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
  backgroundColor: 'var(--nexui-color-surface-canvas)',
  color: 'var(--nexui-color-text-primary)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  cursor: 'pointer',
};

/**
 * Page navigation controls with an explicit list semantics.
 *
 * ARIA / WCAG 2.1 AA:
 * - `nav` with `aria-label` distinguishes the landmark from other navigation regions (1.3.1).
 * - Current page uses `aria-current="page"` on the active item (4.1.2).
 * - `aria-disabled` on Previous/Next when at bounds (2.1.1 Keyboard).
 *
 * Keyboard:
 * - Tab moves through controls; Space/Enter activate buttons (native `<button>`).
 */
export const NexuiPagination = forwardRef<HTMLElement, NexuiPaginationProps>(function NexuiPagination(
  { page, pageCount, onPageChange, className, ...rest },
  ref,
) {
  const safeCount = Math.max(1, pageCount);
  const safePage = Math.min(Math.max(1, page), safeCount);

  const go = useCallback(
    (p: number) => {
      const next = Math.min(Math.max(1, p), safeCount);
      if (next !== safePage) onPageChange(next);
    },
    [onPageChange, safeCount, safePage],
  );

  const items: number[] = Array.from({ length: safeCount }, (_, i) => i + 1);

  return (
    <nav
      ref={ref}
      className={classNames('nexui-pagination', className)}
      style={navStyle}
      aria-label="Pagination"
      {...rest}
    >
      <button
        type="button"
        style={btn}
        disabled={safePage <= 1}
        aria-disabled={safePage <= 1 || undefined}
        onClick={() => {
          go(safePage - 1);
        }}
      >
        Previous
      </button>
      <ol style={listStyle}>
        {items.map((p) => (
          <li key={p}>
            <button
              type="button"
              style={{
                ...btn,
                borderColor: p === safePage ? 'var(--nexui-color-primary-600)' : 'var(--nexui-color-border-default)',
                backgroundColor: p === safePage ? 'var(--nexui-color-primary-600)' : 'var(--nexui-color-surface-canvas)',
                color: p === safePage ? 'var(--nexui-color-text-on-primary)' : 'var(--nexui-color-text-primary)',
              }}
              aria-current={p === safePage ? 'page' : undefined}
              onClick={() => {
                go(p);
              }}
            >
              {String(p)}
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        style={btn}
        disabled={safePage >= safeCount}
        aria-disabled={safePage >= safeCount || undefined}
        onClick={() => {
          go(safePage + 1);
        }}
      >
        Next
      </button>
    </nav>
  );
});

NexuiPagination.displayName = 'NexuiPagination';

// DECISION LOG
// Problem: table toolbars need compact pagination without pulling full data tables.
// Options considered: (1) infinite scroll only; (2) URL-only state; (3) explicit prev/next + numbered list.
// Why I chose this: numbered list preserves spatial awareness and maps cleanly to `aria-current="page"`.
// Trade-off: very large `pageCount` renders many buttons—pair with `NexuiDataGrid` windowing or a compact variant later.

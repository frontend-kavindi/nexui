import { classNames } from '@nexui/utils';
import { Children, forwardRef, isValidElement, type CSSProperties, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';

export type NexuiBreadcrumbProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

const navStyle: CSSProperties = {
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-secondary)',
};

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--nexui-spacing-2)',
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const sep: CSSProperties = {
  color: 'var(--nexui-color-text-tertiary)',
  userSelect: 'none',
};

export type NexuiBreadcrumbItemProps = {
  /** Set on the last crumb only; maps to `aria-current="page"` (4.1.2). */
  current?: boolean;
  children: ReactNode;
} & HTMLAttributes<HTMLLIElement>;

/**
 * Single breadcrumb item; should live inside `NexuiBreadcrumb`.
 */
export const NexuiBreadcrumbItem = forwardRef<HTMLLIElement, NexuiBreadcrumbItemProps>(
  function NexuiBreadcrumbItem({ children, current, className, ...rest }, ref) {
    return (
      <li ref={ref} className={classNames('nexui-breadcrumb-item', className)} {...rest}>
        {current ? (
          <span aria-current="page" style={{ color: 'var(--nexui-color-text-primary)' }}>
            {children}
          </span>
        ) : (
          children
        )}
      </li>
    );
  },
);

NexuiBreadcrumbItem.displayName = 'NexuiBreadcrumbItem';

/**
 * Landmark navigation listing hierarchical location.
 *
 * ARIA / WCAG 2.1 AA:
 * - `nav` with `aria-label` differentiates breadcrumb navigation from primary nav (1.3.1 / 2.4.1 Bypass Blocks).
 * - Ordered list preserves structure (1.3.1).
 * - Last item should set `current` on `NexuiBreadcrumbItem` for `aria-current="page"` (4.1.2).
 *
 * Keyboard:
 * - Links inside items are focusable in DOM order; separators are decorative (`aria-hidden`).
 */
export const NexuiBreadcrumb = forwardRef<HTMLElement, NexuiBreadcrumbProps>(function NexuiBreadcrumb(
  { children, className, ...rest },
  ref,
) {
  const array = Children.toArray(children).filter((child): child is ReactElement => isValidElement(child));
  const flat: ReactElement[] = [];
  array.forEach((child, index) => {
    if (index > 0) {
      flat.push(
        <li key={`nexui-bc-sep-${String(index)}`} aria-hidden style={sep} role="presentation">
          /
        </li>,
      );
    }
    flat.push(child);
  });
  return (
    <nav ref={ref} className={classNames('nexui-breadcrumb', className)} style={navStyle} aria-label="Breadcrumb" {...rest}>
      <ol style={listStyle}>{flat}</ol>
    </nav>
  );
});

NexuiBreadcrumb.displayName = 'NexuiBreadcrumb';

// DECISION LOG
// Problem: product chrome needs hierarchical wayfinding without duplicating global nav landmarks.
// Options considered: (1) plain divs; (2) `aria-label` on `<ol>` only; (3) `nav` + list + separators.
// Why I chose this: `nav` landmark + ordered list matches APG breadcrumb guidance.
// Trade-off: consumers must pass `NexuiBreadcrumbItem` nodes; a string-only API could be added later.

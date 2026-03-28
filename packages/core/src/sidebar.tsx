import { classNames } from '@nexui/utils';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

export type NexuiSidebarProps = {
  /** Landmark label to distinguish side navigation (2.4.1). */
  'aria-label': string;
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

const asideStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-2)',
  width: 'var(--nexui-breakpoint-sm)',
  maxWidth: '100%',
  minHeight: 'var(--nexui-spacing-20)',
  paddingBlock: 'var(--nexui-spacing-4)',
  paddingInline: 'var(--nexui-spacing-3)',
  borderInlineEndWidth: '1px',
  borderInlineEndStyle: 'solid',
  borderInlineEndColor: 'var(--nexui-color-border-default)',
  backgroundColor: 'var(--nexui-color-surface-raised)',
};

/**
 * Application side navigation region.
 *
 * ARIA / WCAG 2.1 AA:
 * - `aside` is a landmark; paired with `aria-label` it is distinguishable in landmark lists (1.3.1 / 2.4.1).
 * - Primary navigation links should be placed in a nested `<nav>` when they are the app menu (1.3.1).
 *
 * Keyboard:
 * - Tab order follows DOM order; consumers manage active link styling and `aria-current` on items.
 */
export const NexuiSidebar = forwardRef<HTMLElement, NexuiSidebarProps>(function NexuiSidebar(
  { className, style, ...rest },
  ref,
) {
  return <aside ref={ref} className={classNames('nexui-sidebar', className)} style={{ ...asideStyle, ...style }} {...rest} />;
});

NexuiSidebar.displayName = 'NexuiSidebar';

// DECISION LOG
// Problem: app shells need a tokenized aside without importing layout frameworks.
// Options considered: (1) `role=navigation` on aside; (2) `<nav>` only; (3) aside landmark + nested nav when needed.
// Why I chose this: `aside` communicates supplementary navigation while letting teams nest `<nav>` for link groups.
// Trade-off: width is a single token breakpoint—expose a `width` prop later if products need resizable rails.

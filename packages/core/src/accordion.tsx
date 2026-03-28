import { classNames } from '@nexui/utils';
import {
  forwardRef,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

export type NexuiAccordionProps = {
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type NexuiAccordionItemProps = {
  /** Button text; becomes the region’s accessible label source via `aria-labelledby` (4.1.2). */
  title: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const stack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-2)',
};

const itemShell: CSSProperties = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
  borderRadius: 'var(--nexui-radius-md)',
  overflow: 'hidden',
  backgroundColor: 'var(--nexui-color-surface-canvas)',
};

const triggerStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--nexui-spacing-3)',
  paddingBlock: 'var(--nexui-spacing-3)',
  paddingInline: 'var(--nexui-spacing-4)',
  border: 'none',
  backgroundColor: 'var(--nexui-color-surface-raised)',
  color: 'var(--nexui-color-text-primary)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  fontWeight: 'var(--nexui-typography-font-weight-medium)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  textAlign: 'start',
  cursor: 'pointer',
};

const panelBody: CSSProperties = {
  paddingBlock: 'var(--nexui-spacing-3)',
  paddingInline: 'var(--nexui-spacing-4)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-primary)',
};

/**
 * Vertical stack for one or more `NexuiAccordionItem` regions.
 *
 * ARIA / WCAG 2.1 AA:
 * - Pure layout wrapper; semantics live on each item’s button + region pairing (4.1.2).
 */
export const NexuiAccordion = forwardRef<HTMLDivElement, NexuiAccordionProps>(function NexuiAccordion(
  { children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={classNames('nexui-accordion', className)} style={stack} {...rest}>
      {children}
    </div>
  );
});

NexuiAccordion.displayName = 'NexuiAccordion';

/**
 * Collapsible region with a disclosure button.
 *
 * ARIA / WCAG 2.1 AA:
 * - Button uses `aria-expanded` so state is programmatically determinable (4.1.2).
 * - `aria-controls` references the panel id for explicit relationship (4.1.2).
 * - Panel uses `role="region"` with `aria-labelledby` pointing at the button for an accessible name (1.3.1 / 4.1.2).
 * - Placing the button inside a heading element (`<h3>`) preserves document outline semantics (1.3.1).
 *
 * Keyboard:
 * - Space / Enter toggle `aria-expanded` (native `<button>` behavior).
 */
export const NexuiAccordionItem = forwardRef<HTMLDivElement, NexuiAccordionItemProps>(
  function NexuiAccordionItem(
    { title, children, defaultOpen = false, className, ...rest },
    ref,
  ) {
    const uid = useId();
    const panelId = `${uid}-panel`;
    const headerId = `${uid}-header`;
    const [open, setOpen] = useState(defaultOpen);

    return (
      <div ref={ref} className={classNames('nexui-accordion-item', className)} style={itemShell} {...rest}>
        <h3
          style={{
            margin: 0,
            fontSize: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
          }}
        >
          <button
            type="button"
            id={headerId}
            aria-expanded={open}
            aria-controls={panelId}
            style={triggerStyle}
            onClick={() => {
              setOpen((o) => !o);
            }}
          >
            <span>{title}</span>
            <span aria-hidden style={{ color: 'var(--nexui-color-text-tertiary)' }}>
              {open ? '−' : '+'}
            </span>
          </button>
        </h3>
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          hidden={!open}
          style={panelBody}
        >
          {open ? children : null}
        </div>
      </div>
    );
  },
);

NexuiAccordionItem.displayName = 'NexuiAccordionItem';

// DECISION LOG
// Problem: disclosure pattern must map cleanly to headings + regions without custom focus traps.
// Options considered: (1) details/summary (limited styling); (2) role=button on div; (3) heading-wrapped real button + region.
// Why I chose this: native button keeps keyboard support for free while heading preserves outline semantics.
// Trade-off: `hidden` removes panel nodes from layout when closed; animated height would require measuring or CSS grid tricks later.

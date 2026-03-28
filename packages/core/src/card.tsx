import { classNames } from '@nexui/utils';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

export type NexuiCardProps = {
  /** Optional title row; rendered as a heading for structure (1.3.1 Info and Relationships). */
  title?: ReactNode;
  children?: ReactNode;
  /** Optional footer actions area. */
  footer?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const shell: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-3)',
  paddingBlock: 'var(--nexui-spacing-4)',
  paddingInline: 'var(--nexui-spacing-4)',
  borderRadius: 'var(--nexui-radius-lg)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
  backgroundColor: 'var(--nexui-color-surface-canvas)',
  boxShadow: 'var(--nexui-shadow-sm)',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-lg)',
  fontWeight: 'var(--nexui-typography-font-weight-semibold)',
  lineHeight: 'var(--nexui-typography-line-height-tight)',
  color: 'var(--nexui-color-text-primary)',
};

const bodyStyle: CSSProperties = {
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-primary)',
};

const footerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 'var(--nexui-spacing-2)',
  paddingTop: 'var(--nexui-spacing-2)',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'var(--nexui-color-border-subtle)',
};

/**
 * Bordered surface grouping related content.
 *
 * ARIA / WCAG 2.1 AA:
 * - Container is a generic group without `role="region"` to avoid redundant landmarks when nested inside main (1.3.1).
 * - When `title` is provided it is rendered as `<h3>` so the card introduces a meaningful subsection heading (1.3.1).
 * - Footer remains in the same reading order as body content for SR linear navigation (2.4.3 Focus Order).
 *
 * Keyboard:
 * - Non-interactive shell; focus moves to interactive descendants only.
 */
export const NexuiCard = forwardRef<HTMLDivElement, NexuiCardProps>(function NexuiCard(
  { title, children, footer, className, style, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={classNames('nexui-card', className)} style={{ ...shell, ...style }} {...rest}>
      {title ? <h3 style={titleStyle}>{title}</h3> : null}
      <div style={bodyStyle}>{children}</div>
      {footer ? <div style={footerStyle}>{footer}</div> : null}
    </div>
  );
});

NexuiCard.displayName = 'NexuiCard';

// DECISION LOG
// Problem: cards are ubiquitous but often mis-modeled as clickable regions without semantics.
// Options considered: (1) `article` always; (2) `role="region"` with aria-label; (3) plain `div` + optional heading.
// Why I chose this: optional `h3` title gives structure without forcing a landmark that duplicates page regions.
// Trade-off: heading level may need local adjustment (`h2`/`h4`) in dense pages—consumers can replace `title` slot later if we expose `as` props.

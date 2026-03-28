import { classNames } from '@nexui/utils';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

export type NexuiBadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export type NexuiBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: NexuiBadgeTone;
  /** When true, exposes polite live region semantics for changing counts (4.1.3 Status Messages). */
  live?: boolean;
};

function toneSurface(tone: NexuiBadgeTone): { bg: string; fg: string; border: string } {
  switch (tone) {
    case 'primary':
      return {
        bg: 'var(--nexui-color-primary-100)',
        fg: 'var(--nexui-color-primary-800)',
        border: 'var(--nexui-color-primary-200)',
      };
    case 'success':
      return {
        bg: 'var(--nexui-color-semantic-success-bgMuted)',
        fg: 'var(--nexui-color-semantic-success-fg)',
        border: 'var(--nexui-color-semantic-success-border)',
      };
    case 'warning':
      return {
        bg: 'var(--nexui-color-semantic-warning-bgMuted)',
        fg: 'var(--nexui-color-semantic-warning-fg)',
        border: 'var(--nexui-color-semantic-warning-border)',
      };
    case 'error':
      return {
        bg: 'var(--nexui-color-semantic-error-bgMuted)',
        fg: 'var(--nexui-color-semantic-error-fg)',
        border: 'var(--nexui-color-semantic-error-border)',
      };
    case 'info':
      return {
        bg: 'var(--nexui-color-semantic-info-bgMuted)',
        fg: 'var(--nexui-color-semantic-info-fg)',
        border: 'var(--nexui-color-semantic-info-border)',
      };
    case 'neutral':
    default:
      return {
        bg: 'var(--nexui-color-surface-sunken)',
        fg: 'var(--nexui-color-text-secondary)',
        border: 'var(--nexui-color-border-default)',
      };
  }
}

/**
 * Compact status or count chip.
 *
 * ARIA / WCAG 2.1 AA:
 * - Static badges are plain text in a `<span>` with no live region to avoid noisy announcements (4.1.3).
 * - When `live` is true we set `role="status"` and `aria-live="polite"` so incremental updates (e.g. unread counts) are surfaced without interrupting (4.1.3 Status Messages).
 * - Color pairings use semantic token groups to preserve non-text contrast against adjacent surfaces (1.4.11).
 *
 * Keyboard:
 * - Non-interactive; no keyboard operations.
 */
export const NexuiBadge = forwardRef<HTMLSpanElement, NexuiBadgeProps>(function NexuiBadge(
  { children, className, tone = 'neutral', live = false, style, ...rest },
  ref,
) {
  const t = toneSurface(tone);
  const merged: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'var(--nexui-spacing-5)',
    paddingBlock: 'var(--nexui-spacing-1)',
    paddingInline: 'var(--nexui-spacing-2)',
    borderRadius: 'var(--nexui-radius-full)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: t.border,
    backgroundColor: t.bg,
    color: t.fg,
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-xs)',
    fontWeight: 'var(--nexui-typography-font-weight-medium)',
    lineHeight: 'var(--nexui-typography-line-height-tight)',
    ...style,
  };

  return (
    <span
      ref={ref}
      className={classNames('nexui-badge', className)}
      style={merged}
      role={live ? 'status' : undefined}
      aria-live={live ? 'polite' : undefined}
      {...rest}
    >
      {children}
    </span>
  );
});

NexuiBadge.displayName = 'NexuiBadge';

// DECISION LOG
// Problem: badges must stay token-driven while supporting both static labels and dynamic counts.
// Options considered: (1) always `role="status"`; (2) `aria-live` without role; (3) opt-in live region.
// Why I chose this: default non-live avoids chatty SR output; `live` opts into polite updates aligned with 4.1.3.
// Trade-off: consumers must remember to enable `live` when values change frequently.

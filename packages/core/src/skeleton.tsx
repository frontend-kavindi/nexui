import { classNames } from '@nexui/utils';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

export type NexuiSkeletonProps = {
  /** Shape preset for common placeholders. */
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
} & HTMLAttributes<HTMLSpanElement>;

function variantStyles(variant: NonNullable<NexuiSkeletonProps['variant']>): CSSProperties {
  switch (variant) {
    case 'circular':
      return {
        width: 'var(--nexui-spacing-10)',
        height: 'var(--nexui-spacing-10)',
        borderRadius: 'var(--nexui-radius-full)',
      };
    case 'rectangular':
      return {
        width: '100%',
        minHeight: 'var(--nexui-spacing-20)',
        borderRadius: 'var(--nexui-radius-md)',
      };
    case 'text':
    default:
      return {
        width: '100%',
        height: 'var(--nexui-spacing-3)',
        borderRadius: 'var(--nexui-radius-sm)',
      };
  }
}

/**
 * Loading placeholder with token-driven pulse animation (`nexui-skeleton-pulse` from theme CSS).
 *
 * ARIA / WCAG 2.1 AA:
 * - `aria-hidden` removes decorative shimmer from the accessibility tree so SR users are not told about grey bars (1.1.1 Non-text Content).
 * - Pair with visible page-level loading messaging (`role="status"`, live region) at the data-fetch boundary—not inside each skeleton atom (4.1.3).
 *
 * Keyboard:
 * - Non-interactive; not focusable.
 */
export const NexuiSkeleton = forwardRef<HTMLSpanElement, NexuiSkeletonProps>(function NexuiSkeleton(
  { className, variant = 'text', style, ...rest },
  ref,
) {
  const merged: CSSProperties = {
    display: 'block',
    backgroundColor: 'var(--nexui-color-surface-sunken)',
    animation:
      'nexui-skeleton-pulse var(--nexui-motion-duration-slow) var(--nexui-motion-easing-easeInOut) infinite',
    ...variantStyles(variant),
    ...style,
  };

  return (
    <span
      ref={ref}
      className={classNames('nexui-skeleton', className)}
      style={merged}
      aria-hidden
      {...rest}
    />
  );
});

NexuiSkeleton.displayName = 'NexuiSkeleton';

// DECISION LOG
// Problem: skeletons should pulse consistently with tokens and avoid fake text strings for SR.
// Options considered: (1) `role="progressbar"` indeterminate; (2) `aria-busy` on parent only; (3) decorative `aria-hidden` spans.
// Why I chose this: per-atom `aria-hidden` plus a documented expectation for parent-level status keeps chatter low.
// Trade-off: consumers must hoist meaningful loading announcements; skeletons alone are silent.

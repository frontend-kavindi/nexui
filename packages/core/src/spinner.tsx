import { classNames } from '@nexui/utils';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

export type NexuiSpinnerSize = 'sm' | 'md' | 'lg';

export type NexuiSpinnerProps = {
  /** Visually scales the vector using spacing tokens only. */
  size?: NexuiSpinnerSize;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const DIM: Record<NexuiSpinnerSize, string> = {
  sm: 'var(--nexui-spacing-4)',
  md: 'var(--nexui-spacing-6)',
  lg: 'var(--nexui-spacing-8)',
};

/**
 * Indeterminate progress indicator for inline loading states.
 *
 * ARIA / WCAG 2.1 AA:
 * - Container uses `role="status"` and `aria-live="polite"` so assistive tech is notified of ongoing activity without interrupting (4.1.3 Status Messages).
 * - The vector is `aria-hidden` so the accessible name comes from `aria-label` on the wrapper (4.1.2).
 * - Consumers should pass a concise `aria-label` (e.g. “Loading”) when the spinner is the primary loading cue (2.4.6 Headings and Labels).
 *
 * Keyboard:
 * - Non-interactive; not focusable.
 */
export const NexuiSpinner = forwardRef<HTMLDivElement, NexuiSpinnerProps>(function NexuiSpinner(
  { size = 'md', className, style, 'aria-label': ariaLabel = 'Loading', ...rest },
  ref,
) {
  const dim = DIM[size];
  const wrap: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  return (
    <div
      ref={ref}
      className={classNames('nexui-spinner', className)}
      style={wrap}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      {...rest}
    >
      <svg
        aria-hidden
        focusable="false"
        style={{
          width: dim,
          height: dim,
          flexShrink: 0,
          animation: 'nexui-spin var(--nexui-motion-duration-slow) linear infinite',
          transformOrigin: 'center',
        }}
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="var(--nexui-spacing-1)"
          strokeDasharray="50"
          strokeLinecap="round"
          style={{ color: 'var(--nexui-color-primary-600)', opacity: 'var(--nexui-opacity-subdued)' }}
        />
      </svg>
    </div>
  );
});

NexuiSpinner.displayName = 'NexuiSpinner';

// DECISION LOG
// Problem: buttons already embed a spinner, but full-page and async regions need a standalone tokenized spinner.
// Options considered: (1) re-export button’s internal glyph; (2) duplicate minimal SVG here; (3) CSS-only border spinner.
// Why I chose this: duplicate SVG keeps `spinner` import free of button bundle coupling while reusing the same `nexui-spin` keyframe from themes.
// Trade-off: two SVG definitions exist until a shared `@nexui/icons` package exists.

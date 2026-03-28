import { classNames } from '@nexui/utils';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

export type NexuiProgressBarProps = {
  /** 0–100 inclusive when `value` is set; omit for indeterminate. */
  value?: number;
  /** Accessible label for the progress (2.4.6). */
  'aria-label': string;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax'>;

const track: CSSProperties = {
  width: '100%',
  height: 'var(--nexui-spacing-2)',
  borderRadius: 'var(--nexui-radius-full)',
  backgroundColor: 'var(--nexui-color-surface-sunken)',
  overflow: 'hidden',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
};

/**
 * Linear progress meter with determinate or indeterminate states.
 *
 * ARIA / WCAG 2.1 AA:
 * - `role="progressbar"` exposes the control (4.1.2 Name, Role, Value).
 * - Determinate values set `aria-valuenow/min/max` for proportional tasks (4.1.2).
 * - Indeterminate omits value attributes and relies on `aria-busy` semantics implied by progressbar without value in some AT; we still expose `aria-label` (4.1.2).
 *
 * Keyboard:
 * - Non-interactive; not focusable.
 */
export const NexuiProgressBar = forwardRef<HTMLDivElement, NexuiProgressBarProps>(function NexuiProgressBar(
  { value, className, style, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const determinate = value !== undefined;
  const clamped = determinate ? Math.min(100, Math.max(0, value)) : undefined;
  const fill: CSSProperties = {
    height: '100%',
    width: determinate ? `${String(clamped)}%` : '40%',
    borderRadius: 'var(--nexui-radius-full)',
    backgroundColor: 'var(--nexui-color-primary-600)',
    transitionProperty: 'width',
    transitionDuration: 'var(--nexui-motion-duration-normal)',
    transitionTimingFunction: 'var(--nexui-motion-easing-easeOut)',
    ...(determinate
      ? {}
      : {
          animation: 'nexui-skeleton-pulse var(--nexui-motion-duration-slow) var(--nexui-motion-easing-easeInOut) infinite',
        }),
  };

  return (
    <div
      ref={ref}
      className={classNames('nexui-progress-bar', className)}
      style={{ ...track, ...style }}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? 100 : undefined}
      aria-valuenow={clamped}
      {...rest}
    >
      <div style={fill} />
    </div>
  );
});

NexuiProgressBar.displayName = 'NexuiProgressBar';

// DECISION LOG
// Problem: many designs need a simple determinate bar without pulling charting libraries.
// Options considered: (1) native `<progress>`; (2) meter role; (3) div progressbar + inner fill.
// Why I chose this: div + inner fill styles cleanly with tokens; `progress` styling is inconsistent across browsers.
// Trade-off: indeterminate animation reuses skeleton pulse for motion parity—swap to a dedicated keyframe if product wants a barber-pole effect.

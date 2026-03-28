import { classNames } from '@nexui/utils';
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';

export type NexuiButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type NexuiButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type NexuiButtonProps = {
  children?: ReactNode;
  variant?: NexuiButtonVariant;
  size?: NexuiButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SPINNER_DIM: Record<NexuiButtonSize, string> = {
  xs: 'var(--nexui-spacing-3)',
  sm: 'var(--nexui-spacing-4)',
  md: 'var(--nexui-spacing-4)',
  lg: 'var(--nexui-spacing-5)',
  xl: 'var(--nexui-spacing-6)',
};

const SIZE_PADDING: Record<
  NexuiButtonSize,
  Pick<CSSProperties, 'paddingBlock' | 'paddingInline' | 'fontSize' | 'lineHeight' | 'gap'>
> = {
  xs: {
    paddingBlock: 'var(--nexui-spacing-1)',
    paddingInline: 'var(--nexui-spacing-2)',
    fontSize: 'var(--nexui-typography-font-size-xs)',
    lineHeight: 'var(--nexui-typography-line-height-snug)',
    gap: 'var(--nexui-spacing-1)',
  },
  sm: {
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-3)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
    lineHeight: 'var(--nexui-typography-line-height-snug)',
    gap: 'var(--nexui-spacing-1)',
  },
  md: {
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-4)',
    fontSize: 'var(--nexui-typography-font-size-md)',
    lineHeight: 'var(--nexui-typography-line-height-normal)',
    gap: 'var(--nexui-spacing-2)',
  },
  lg: {
    paddingBlock: 'var(--nexui-spacing-3)',
    paddingInline: 'var(--nexui-spacing-5)',
    fontSize: 'var(--nexui-typography-font-size-lg)',
    lineHeight: 'var(--nexui-typography-line-height-normal)',
    gap: 'var(--nexui-spacing-2)',
  },
  xl: {
    paddingBlock: 'var(--nexui-spacing-4)',
    paddingInline: 'var(--nexui-spacing-6)',
    fontSize: 'var(--nexui-typography-font-size-xl)',
    lineHeight: 'var(--nexui-typography-line-height-relaxed)',
    gap: 'var(--nexui-spacing-3)',
  },
};

function variantStyles(variant: NexuiButtonVariant, disabled: boolean): CSSProperties {
  const base: CSSProperties = {
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontWeight: 'var(--nexui-typography-font-weight-medium)',
    borderRadius: 'var(--nexui-radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderStyle: 'solid',
    borderWidth: '1px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: undefined,
    opacity: disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
  };

  switch (variant) {
    case 'primary':
      return {
        ...base,
        borderColor: 'var(--nexui-color-primary-600)',
        backgroundColor: 'var(--nexui-color-primary-600)',
        color: 'var(--nexui-color-text-on-primary)',
      };
    case 'secondary':
      return {
        ...base,
        borderColor: 'var(--nexui-color-border-default)',
        backgroundColor: 'var(--nexui-color-surface-canvas)',
        color: 'var(--nexui-color-text-primary)',
      };
    case 'ghost':
      return {
        ...base,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        color: 'var(--nexui-color-text-primary)',
      };
    case 'danger':
      return {
        ...base,
        borderColor: 'var(--nexui-color-semantic-error-border)',
        backgroundColor: 'var(--nexui-color-semantic-error-bg)',
        color: 'var(--nexui-color-semantic-error-fg)',
      };
    case 'link':
      return {
        ...base,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        color: 'var(--nexui-color-primary-600)',
        textDecoration: 'underline',
        textUnderlineOffset: 'var(--nexui-spacing-1)',
      };
    default: {
      const _x: never = variant;
      return _x;
    }
  }
}

function NexuiSpinner({ size }: { size: NexuiButtonSize }) {
  const dim = SPINNER_DIM[size];
  return (
    <svg
      aria-hidden
      focusable="false"
      style={{
        width: dim,
        height: dim,
        flexShrink: 0,
        animation:
          'nexui-spin var(--nexui-motion-duration-slow) linear infinite',
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
        style={{ opacity: 'var(--nexui-opacity-subdued)' }}
      />
    </svg>
  );
}

/**
 * Accessible button / link-styled control.
 *
 * ARIA / WCAG 2.1 AA:
 * - Uses native `<button>` so role, focusability, and keyboard activation come for free (Success Criterion 4.1.2 Name, Role, Value).
 * - `aria-busy` mirrors the loading spinner so assistive tech knows the control is pending (4.1.3 Status Messages — paired with live content in surrounding regions if needed).
 * - When `loading` is true we set `disabled` to avoid duplicate submissions (3.3.7 Redundant Entry / error prevention patterns).
 * - Icon-only or spinner-only states MUST pass a visible `children` label or rely on `aria-label` from attrs (2.4.6 Headings and Labels / button accessible name).
 *
 * Keyboard:
 * - Enter / Space: activates the button (native `<button>` behavior).
 * - Tab / Shift+Tab: moves focus according to document order; no custom roving tabindex.
 */
export const NexuiButton = forwardRef<HTMLButtonElement, NexuiButtonProps>(
  function NexuiButton(
    {
      children,
      className,
      variant = 'secondary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      style,
      type = 'button',
      disabled,
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;
    const pad = SIZE_PADDING[size];
    const merged: CSSProperties = {
      ...variantStyles(variant, isDisabled),
      ...pad,
      flexDirection: 'row',
      boxSizing: 'border-box',
      width: fullWidth ? '100%' : undefined,
      ...style,
    };

    return (
      <button
        ref={ref}
        type={type}
        className={classNames('nexui-button', className)}
        style={merged}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? <NexuiSpinner size={size} /> : iconLeft}
        {children}
        {!loading && iconRight}
      </button>
    );
  },
);

NexuiButton.displayName = 'NexuiButton';

// DECISION LOG
// Problem: combining five visual variants, five sizes, loading, and icons without exploding CSS-in-JS or breaking token-only styling.
// Options considered: (1) styled-components / CSS modules per variant; (2) Tailwind utility strings; (3) inline style maps keyed by variant/size using CSS variables only.
// Why I chose this: inline maps over `var(--nexui-*)` keep the package bundler-agnostic, theme-swappable, and aligned with the existing token pipeline—no second source of truth.
// Trade-off: slightly more runtime object merging than static CSS classes; harder to micro-optimize repaint for very hot lists (mitigate with memoized style objects later if profiling demands it).

import { classNames } from '@nexui/utils';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export type NexuiCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  /** Visible label; association uses `htmlFor`/`id` (WCAG 3.3.2). */
  label: ReactNode;
  /** Sets the native `indeterminate` property for mixed states (ARIA reflects via native checkbox semantics in supporting AT). */
  indeterminate?: boolean;
};

const row: CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 'var(--nexui-spacing-2)',
  cursor: 'pointer',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-primary)',
};

const inputStyle: CSSProperties = {
  width: 'var(--nexui-spacing-4)',
  height: 'var(--nexui-spacing-4)',
  margin: 0,
  marginTop: 'var(--nexui-spacing-1)',
  flexShrink: 0,
  accentColor: 'var(--nexui-color-primary-600)',
  cursor: 'inherit',
};

/**
 * Checkbox with an explicit text label and optional indeterminate state.
 *
 * ARIA / WCAG 2.1 AA:
 * - Native `<input type="checkbox">` exposes the correct role and checked state to assistive tech (4.1.2 Name, Role, Value).
 * - Visible `label` element wired with `htmlFor`/`id` satisfies Labels or Instructions (3.3.2) and gives the control an accessible name (4.1.2).
 * - `disabled` is forwarded so the control is removed from the tab order and announced as unavailable (2.1.1 Keyboard).
 * - Indeterminate is applied only via the DOM property; we do not set `aria-checked="mixed"` on a native checkbox to avoid double-speaking with some engines that already map indeterminate.
 *
 * Keyboard:
 * - Space toggles the checkbox when focused (native behavior).
 * - Tab / Shift+Tab move focus to/from the control in document order.
 */
export const NexuiCheckbox = forwardRef<HTMLInputElement, NexuiCheckboxProps>(
  function NexuiCheckbox(
    {
      className,
      label,
      id: idProp,
      indeterminate = false,
      style,
      disabled,
      ...rest
    },
    ref,
  ) {
    const uid = useId();
    const id = idProp ?? `nexui-checkbox-${uid}`;
    const innerRef = useRef<HTMLInputElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    useEffect(() => {
      const el = innerRef.current;
      if (el) {
        el.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const labelStyle: CSSProperties = {
      ...row,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
      ...style,
    };

    return (
      <label htmlFor={id} className={classNames('nexui-checkbox', className)} style={labelStyle}>
        <input
          ref={setRefs}
          id={id}
          type="checkbox"
          className="nexui-checkbox-input"
          style={inputStyle}
          disabled={disabled}
          {...rest}
        />
        <span>{label}</span>
      </label>
    );
  },
);

NexuiCheckbox.displayName = 'NexuiCheckbox';

// DECISION LOG
// Problem: custom-drawn checkboxes often drift from native checkbox semantics and break SR announcements.
// Options considered: (1) fully custom `role="checkbox"` + key handlers; (2) visually hidden native input + decorative glyph; (3) styled native input with `accent-color` token.
// Why I chose this: native input keeps behavior and accessibility mapping while `accentColor` ties focus/checked hues to the theme pipeline.
// Trade-off: visual fidelity is bounded by UA checkbox painting; enterprise branding may still prefer a decorative path later.

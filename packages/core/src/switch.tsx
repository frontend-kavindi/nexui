import { classNames } from '@nexui/utils';
import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

export type NexuiSwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role' | 'type'> & {
  /** Visible label placed beside the track (2.4.6 Headings and Labels). */
  label: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const row: CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'var(--nexui-spacing-3)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-primary)',
};

const track: CSSProperties = {
  position: 'relative',
  width: 'var(--nexui-spacing-10)',
  height: 'var(--nexui-spacing-5)',
  borderRadius: 'var(--nexui-radius-full)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
  backgroundColor: 'var(--nexui-color-surface-sunken)',
  flexShrink: 0,
  transitionProperty: 'background-color, border-color',
  transitionDuration: 'var(--nexui-motion-duration-normal)',
  transitionTimingFunction: 'var(--nexui-motion-easing-easeOut)',
};

const thumb: CSSProperties = {
  position: 'absolute',
  top: 'var(--nexui-spacing-1)',
  left: 'var(--nexui-spacing-1)',
  width: 'var(--nexui-spacing-3)',
  height: 'var(--nexui-spacing-3)',
  borderRadius: 'var(--nexui-radius-full)',
  backgroundColor: 'var(--nexui-color-surface-canvas)',
  boxShadow: 'var(--nexui-shadow-sm)',
  transitionProperty: 'transform',
  transitionDuration: 'var(--nexui-motion-duration-normal)',
  transitionTimingFunction: 'var(--nexui-motion-easing-spring)',
};

/**
 * Toggle switch using the `switch` role (not a native checkbox) for explicit semantics.
 *
 * ARIA / WCAG 2.1 AA:
 * - `role="switch"` differentiates on/off affordances from `checkbox` tri-state expectations (4.1.2 Name, Role, Value).
 * - `aria-checked` mirrors the boolean state for AT (4.1.2).
 * - Visible `label` is associated with `aria-labelledby` so the switch has a computed accessible name even though the label is not a native `<label for>` (3.3.2 / 4.1.2).
 * - `disabled` maps to native `disabled` on `<button>` plus `aria-disabled` for redundant exposure (2.1.1).
 *
 * Keyboard:
 * - Space / Enter toggle when focus is on the switch (button activation).
 * - Tab / Shift+Tab move focus according to document order.
 */
export const NexuiSwitch = forwardRef<HTMLButtonElement, NexuiSwitchProps>(function NexuiSwitch(
  {
    className,
    label,
    id: idProp,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    style,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const id = idProp ?? `nexui-switch-${uid}`;
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : uncontrolled;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) {
      setUncontrolled(next);
    }
    onCheckedChange?.(next);
  }, [checked, disabled, isControlled, onCheckedChange]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
    onKeyDown?.(e);
  };

  const trackStyle: CSSProperties = {
    ...track,
    borderColor: checked ? 'var(--nexui-color-primary-600)' : 'var(--nexui-color-border-default)',
    backgroundColor: checked ? 'var(--nexui-color-primary-600)' : 'var(--nexui-color-surface-sunken)',
  };

  const thumbStyle: CSSProperties = {
    ...thumb,
    transform: checked ? 'translateX(var(--nexui-spacing-5))' : 'translateX(0)',
  };

  const wrap: CSSProperties = {
    ...row,
    opacity: disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
    ...style,
  };

  return (
    <div className={classNames('nexui-switch', className)} style={wrap}>
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <span style={trackStyle} aria-hidden>
          <span style={thumbStyle} />
        </span>
      </button>
      <span id={labelId}>{label}</span>
    </div>
  );
});

NexuiSwitch.displayName = 'NexuiSwitch';

// DECISION LOG
// Problem: product wants a switch affordance distinct from checkbox while staying token-only and keyboard reachable.
// Options considered: (1) checkbox with `role="switch"` (invalid mix); (2) native checkbox visually styled; (3) `<button role="switch">` with track/thumb spans.
// Why I chose this: button + switch role matches APG guidance and avoids fighting native checkbox semantics.
// Trade-off: no native form submission value; consumers must wire controlled state into their form layer.

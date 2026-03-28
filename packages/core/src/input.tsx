import { classNames } from '@nexui/utils';
import {
  forwardRef,
  useId,
  useState,
  type ChangeEventHandler,
  type CSSProperties,
  type FocusEventHandler,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export type NexuiInputProps = {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: boolean;
  /** Optional message when `error` is true; defaults to a generic error hint. */
  errorMessage?: ReactNode;
  success?: boolean;
  showPasswordToggle?: boolean;
  maxLength?: number;
  clearable?: boolean;
  onClear?: () => void;
  containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function mergeFieldChrome(error: boolean, success: boolean, focused: boolean): CSSProperties {
  const base = {
    borderStyle: 'solid' as const,
    borderWidth: '1px',
    borderRadius: 'var(--nexui-radius-md)',
    backgroundColor: 'var(--nexui-color-surface-canvas)',
  };
  if (error) {
    return {
      ...base,
      borderColor: 'var(--nexui-color-semantic-error-border)',
      boxShadow: '0 0 0 1px var(--nexui-color-semantic-error-border)',
    };
  }
  if (success) {
    return {
      ...base,
      borderColor: 'var(--nexui-color-semantic-success-border)',
      boxShadow: '0 0 0 1px var(--nexui-color-semantic-success-border)',
    };
  }
   
  if (focused) {
    return {
      ...base,
      borderColor: 'var(--nexui-color-border-focus)',
      boxShadow: '0 0 0 2px var(--nexui-color-border-focus)',
    };
  }
  return {
    ...base,
    borderColor: 'var(--nexui-color-border-default)',
    boxShadow: 'none',
  };
}

/**
 * Text field with label, helper, validation chrome, password visibility, counter, and clear.
 *
 * ARIA / WCAG 2.1 AA:
 * - `label` + `htmlFor`/`id` pairing (3.3.2 Labels or Instructions).
 * - `aria-invalid` on the input when `error` (3.3.1 Error Identification).
 * - `aria-describedby` references helper, error copy, and live counter region (4.1.2 Name, Role, Value).
 * - Password toggle uses `aria-pressed` plus an explicit accessible name (2.4.6 Headings and Labels).
 * - Error copy uses `role="alert"` so the failure is surfaced immediately (4.1.3 Status Messages).
 *
 * Keyboard:
 * - Standard typing, selection, and undo inside the `<input>`.
 * - Tab / Shift+Tab reach the suffix buttons; Space / Enter activates those `button` elements.
 */
export const NexuiInput = forwardRef<HTMLInputElement, NexuiInputProps>(function NexuiInput(
  {
    label,
    helperText,
    error = false,
    errorMessage = 'This field has an error.',
    success = false,
    showPasswordToggle = false,
    clearable = false,
    onClear,
    containerClassName,
    className,
    disabled,
    type = 'text',
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    maxLength,
    id: idProp,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const id = idProp ?? `nexui-input-${uid}`;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const counterId = `${id}-counter`;

  const [uncontrolled, setUncontrolled] = useState<string>(() =>
    typeof defaultValue === 'string' ? defaultValue : '',
  );
  const [reveal, setReveal] = useState(false);
  const [focused, setFocused] = useState(false);

  const isControlled = value !== undefined;
  const current = isControlled ? String(value) : uncontrolled;

  const effectiveType =
    type === 'password' && showPasswordToggle && reveal ? 'text' : type === 'password' ? 'password' : type;

  const describedBy = [
    helperText ? helperId : '',
    error ? errorId : '',
    maxLength !== undefined ? counterId : '',
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const showSuccess = success && !error;

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!isControlled) setUncontrolled(e.target.value);
    onChange?.(e);
  };

  const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const clear = () => {
    if (!isControlled) setUncontrolled('');
    onClear?.();
  };

  const shell: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--nexui-spacing-2)',
    width: '100%',
  };

  const labelStyle: CSSProperties = {
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
    fontWeight: 'var(--nexui-typography-font-weight-medium)',
    color: 'var(--nexui-color-text-primary)',
  };

  const wrap: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    ...mergeFieldChrome(error, showSuccess, focused && !error),
    overflow: 'hidden',
  };

  const inputStyle: CSSProperties = {
    flex: '1 1 auto',
    minWidth: 0,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-md)',
    lineHeight: 'var(--nexui-typography-line-height-normal)',
    color: 'var(--nexui-color-text-primary)',
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-3)',
  };

  const affixBtn: CSSProperties = {
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-2)',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--nexui-color-text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    alignSelf: 'center',
  };

  const suffixRail: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 'var(--nexui-spacing-1)',
    paddingInlineEnd: 'var(--nexui-spacing-2)',
  };

  const helperStyle: CSSProperties = {
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
    lineHeight: 'var(--nexui-typography-line-height-normal)',
    color: 'var(--nexui-color-text-secondary)',
  };

  const counterStyle: CSSProperties = {
    ...helperStyle,
    color: 'var(--nexui-color-text-tertiary)',
    textAlign: 'end',
  };

  return (
    <div className={classNames('nexui-input-field', containerClassName)} style={shell}>
      {label ? (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      ) : null}
      <div style={wrap}>
        <input
          ref={ref}
          id={id}
          className={classNames('nexui-input', className)}
          style={inputStyle}
          type={effectiveType}
          disabled={disabled}
          value={isControlled ? value : uncontrolled}
          maxLength={maxLength}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          onChange={onInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        <div style={suffixRail}>
          {clearable && !disabled && current.length > 0 ? (
            <button type="button" style={affixBtn} aria-label="Clear value" onClick={clear}>
              ×
            </button>
          ) : null}
          {type === 'password' && showPasswordToggle ? (
            <button
              type="button"
              style={affixBtn}
              aria-pressed={reveal}
              aria-label={reveal ? 'Hide password' : 'Show password'}
              disabled={disabled}
              onClick={() => { setReveal((v) => !v); }}
            >
              {reveal ? 'Hide' : 'Show'}
            </button>
          ) : null}
        </div>
      </div>
      {helperText ? (
        <p id={helperId} style={helperStyle}>
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" style={{ ...helperStyle, color: 'var(--nexui-color-semantic-error-fg)' }}>
          {errorMessage}
        </p>
      ) : null}
      {maxLength !== undefined ? (
        <p id={counterId} style={counterStyle} aria-live="polite">
          {current.length} / {maxLength}
        </p>
      ) : null}
    </div>
  );
});

NexuiInput.displayName = 'NexuiInput';

// DECISION LOG
// Problem: multiple trailing controls (clear + password toggle) often break single-focus-ring UX or duplicate borders that fail non-text contrast.
// Options considered: (1) absolutely positioned icons; (2) separate bordered chips; (3) one bordered flex shell with a borderless input.
// Why I chose this: a single bordered wrapper keeps token-driven strokes and lets focus styling remain one continuous perimeter via `mergeFieldChrome`.
// Trade-off: `color-mix` for focus halo requires modern engines; provide fallback later if you must support legacy browsers.

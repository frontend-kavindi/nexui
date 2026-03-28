import { classNames } from '@nexui/utils';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export type NexuiRadioGroupProps = {
  /** Shared `name` for grouped radios; auto-generated when omitted (still valid for forms in the same render tree). */
  name?: string;
  /** Optional legend copy; rendered in `<legend>` for the implicit fieldset (1.3.1 Info and Relationships). */
  label?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

export type NexuiRadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> & {
  label: ReactNode;
  value: string;
};

type RadioGroupCtx = {
  name: string;
  value: string;
  setValue: (v: string) => void;
  disabled: boolean;
};

const RadioGroupContext = createContext<RadioGroupCtx | null>(null);

function useRadioGroup(component: string): RadioGroupCtx {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error(`${component} must be used within NexuiRadioGroup`);
  }
  return ctx;
}

const fieldset: CSSProperties = {
  border: 'none',
  margin: 0,
  padding: 0,
  minWidth: 0,
};

const legendStyle: CSSProperties = {
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  fontWeight: 'var(--nexui-typography-font-weight-medium)',
  color: 'var(--nexui-color-text-primary)',
  padding: 0,
  marginBottom: 'var(--nexui-spacing-2)',
};

const groupStack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-2)',
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
 * Groups radios with a single selection model and optional legend.
 *
 * ARIA / WCAG 2.1 AA:
 * - Container uses `role="radiogroup"` so assistive tech announces the grouping boundary (1.3.1 Info and Relationships).
 * - When `label` is provided it becomes the accessible name of the radiogroup via `aria-labelledby` pointing at the legend id (4.1.2 Name, Role, Value).
 * - `aria-disabled` on the group mirrors the `disabled` flag for AT when all radios are inert (2.1.1 Keyboard).
 *
 * Keyboard:
 * - Arrow keys between radios are handled by the browser for grouped `name` attributes in many UAs; we keep native inputs to preserve that behavior.
 */
export const NexuiRadioGroup = forwardRef<HTMLFieldSetElement, NexuiRadioGroupProps>(
  function NexuiRadioGroup(
    {
      name: nameProp,
      label,
      value: valueControlled,
      defaultValue = '',
      onValueChange,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const uid = useId();
    const name = nameProp ?? `nexui-radio-${uid}`;
    const legendId = `${uid}-legend`;
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const isControlled = valueControlled !== undefined;
    const value = isControlled ? valueControlled : uncontrolled;

    const setValue = useCallback(
      (v: string) => {
        if (!isControlled) {
          setUncontrolled(v);
        }
        onValueChange?.(v);
      },
      [isControlled, onValueChange],
    );

    const ctx = useMemo(
      (): RadioGroupCtx => ({
        name,
        value,
        setValue,
        disabled,
      }),
      [name, value, setValue, disabled],
    );

    const labelledBy = label ? legendId : undefined;

    return (
      <RadioGroupContext.Provider value={ctx}>
        <fieldset
          ref={ref}
          className={classNames('nexui-radio-group', className)}
          style={fieldset}
          {...rest}
          role="radiogroup"
          aria-labelledby={labelledBy}
          aria-disabled={disabled || undefined}
        >
          {label ? (
            <legend id={legendId} style={legendStyle}>
              {label}
            </legend>
          ) : null}
          <div style={groupStack}>{children}</div>
        </fieldset>
      </RadioGroupContext.Provider>
    );
  },
);

NexuiRadioGroup.displayName = 'NexuiRadioGroup';

/**
 * Radio option participating in `NexuiRadioGroup`.
 *
 * ARIA / WCAG 2.1 AA:
 * - Native `type="radio"` supplies correct role and checked state (4.1.2).
 * - Label association uses `htmlFor`/`id` (3.3.2).
 * - `checked` is derived from group value so the checked state is programmatically determinable (4.1.2).
 */
export const NexuiRadio = forwardRef<HTMLInputElement, NexuiRadioProps>(function NexuiRadio(
  { className, label, id: idProp, value, style, disabled: disabledProp, onChange, ...rest },
  ref,
) {
  const ctx = useRadioGroup('NexuiRadio');
  const uid = useId();
  const id = idProp ?? `nexui-radio-opt-${uid}`;
  const disabled = disabledProp || ctx.disabled;
  const checked = ctx.value === value;

  const labelStyle: CSSProperties = {
    ...row,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
    ...style,
  };

  return (
    <label htmlFor={id} className={classNames('nexui-radio', className)} style={labelStyle}>
      <input
        ref={ref}
        id={id}
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={disabled}
        className="nexui-radio-input"
        style={inputStyle}
        onChange={(e) => {
          ctx.setValue(value);
          onChange?.(e);
        }}
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
});

NexuiRadio.displayName = 'NexuiRadio';

// DECISION LOG
// Problem: radio groups need exactly-one selection semantics, a group label, and consistent `name` wiring across items.
// Options considered: (1) fully custom roving tabindex radiogroup; (2) Radix-style collection APIs; (3) fieldset + native radios + React context for value.
// Why I chose this: native radios preserve platform conventions for arrow-key navigation where supported, while context keeps controlled/uncontrolled state ergonomic.
// Trade-off: visual styling is still UA-dependent like checkboxes; advanced keyboard patterns from APG may require a custom widget later.

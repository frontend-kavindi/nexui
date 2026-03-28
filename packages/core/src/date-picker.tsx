import { classNames } from '@nexui/utils';
import { forwardRef, useId, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';

export type NexuiDatePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  /** Visible label; associated via `htmlFor`/`id` (3.3.2). */
  label: ReactNode;
};

const stack: CSSProperties = {
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

const inputStyle: CSSProperties = {
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-3)',
  borderRadius: 'var(--nexui-radius-md)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
  backgroundColor: 'var(--nexui-color-surface-canvas)',
  color: 'var(--nexui-color-text-primary)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-md)',
  minHeight: 'var(--nexui-spacing-10)',
};

/**
 * Date input with an explicit label; wraps native `type="date"` for broad UA support.
 *
 * ARIA / WCAG 2.1 AA:
 * - Native date inputs expose a consistent role/value where supported (4.1.2).
 * - `label` + `htmlFor` pairing satisfies Labels or Instructions (3.3.2).
 * - Validation messages should be wired with `aria-describedby` by consumers when needed (3.3.1).
 *
 * Keyboard:
 * - Follows native date picker shortcuts per platform; Tab reaches the control in order.
 */
export const NexuiDatePicker = forwardRef<HTMLInputElement, NexuiDatePickerProps>(function NexuiDatePicker(
  { label, id: idProp, className, style, disabled, ...rest },
  ref,
) {
  const uid = useId();
  const id = idProp ?? `nexui-date-${uid}`;

  return (
    <div className={classNames('nexui-date-picker', className)} style={stack}>
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type="date"
        disabled={disabled}
        style={{ ...inputStyle, ...style }}
        {...rest}
      />
    </div>
  );
});

NexuiDatePicker.displayName = 'NexuiDatePicker';

// DECISION LOG
// Problem: accessible date entry without shipping a heavy calendar widget.
// Options considered: (1) headless calendar + grid role; (2) three `<select>`; (3) native `input[type=date]`.
// Why I chose this: native input keeps platform conventions and minimizes bundle size.
// Trade-off: styling is partially UA-controlled; enterprise branding may require a full calendar component later.

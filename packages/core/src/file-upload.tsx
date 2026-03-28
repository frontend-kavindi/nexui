import { classNames } from '@nexui/utils';
import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEventHandler,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

export type NexuiFileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Button and region label (2.4.6). */
  label: ReactNode;
  /** Optional hint under the control. */
  hint?: ReactNode;
};

const stack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-2)',
  width: '100%',
};

const drop: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--nexui-spacing-2)',
  paddingBlock: 'var(--nexui-spacing-6)',
  paddingInline: 'var(--nexui-spacing-4)',
  borderRadius: 'var(--nexui-radius-lg)',
  borderWidth: '1px',
  borderStyle: 'dashed',
  borderColor: 'var(--nexui-color-border-default)',
  backgroundColor: 'var(--nexui-color-surface-raised)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  color: 'var(--nexui-color-text-secondary)',
};

const hintStyle: CSSProperties = {
  fontSize: 'var(--nexui-typography-font-size-xs)',
  color: 'var(--nexui-color-text-tertiary)',
};

/**
 * File picker with a large hit target and visually hidden native input.
 *
 * ARIA / WCAG 2.1 AA:
 * - Native `<input type="file">` retains upload semantics (4.1.2).
 * - The visible dropzone is a `<label>` pointing at the input id so the whole region activates the picker (2.5.1 Target Size / 3.3.2).
 * - `aria-describedby` references optional hint text (3.3.2).
 *
 * Keyboard:
 * - Space/Enter on the associated label triggers the file dialog (native behavior).
 */
export const NexuiFileUpload = forwardRef<HTMLInputElement, NexuiFileUploadProps>(function NexuiFileUpload(
  { label, hint, id: idProp, className, disabled, onChange, style, ...rest },
  ref,
) {
  const uid = useId();
  const id = idProp ?? `nexui-file-${uid}`;
  const hintId = `${id}-hint`;
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

  const [dragOver, setDragOver] = useState(false);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e);
  };

  return (
    <div className={classNames('nexui-file-upload', className)} style={{ ...stack, ...style }}>
      <input
        ref={setRefs}
        id={id}
        type="file"
        disabled={disabled}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        aria-describedby={hint ? hintId : undefined}
        onChange={handleChange}
        {...rest}
      />
      <label
        htmlFor={id}
        style={{
          ...drop,
          outlineStyle: dragOver ? 'solid' : undefined,
          outlineWidth: dragOver ? '2px' : undefined,
          outlineColor: dragOver ? 'var(--nexui-color-border-focus)' : undefined,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 'var(--nexui-opacity-subdued)' : 'var(--nexui-opacity-full)',
        }}
        onDragEnter={() => {
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => {
          setDragOver(false);
        }}
        onDragOver={(e) => {
          if (!disabled) e.preventDefault();
        }}
        onDrop={(e) => {
          if (disabled) return;
          e.preventDefault();
          setDragOver(false);
          const input = innerRef.current;
          if (!input || e.dataTransfer.files.length === 0) return;
          const dt = new DataTransfer();
          for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
            const file = e.dataTransfer.files.item(i);
            if (file) dt.items.add(file);
          }
          input.files = dt.files;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }}
      >
        <span style={{ fontWeight: 'var(--nexui-typography-font-weight-medium)', color: 'var(--nexui-color-text-primary)' }}>
          {label}
        </span>
        <span>Choose file or drag here</span>
      </label>
      {hint ? (
        <p id={hintId} style={hintStyle}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});

NexuiFileUpload.displayName = 'NexuiFileUpload';

// DECISION LOG
// Problem: styled uploads often break SR expectations by hiding `<input type="file">` incorrectly.
// Options considered: (1) button + programmatic click only; (2) drag-only; (3) visually hidden input + `<label>` drop target.
// Why I chose this: `label[for]` keeps a single accessible name path and a large touch target.
// Trade-off: drag-and-drop file assignment uses `DataTransfer` mapping—retest in target browsers for enterprise policies.

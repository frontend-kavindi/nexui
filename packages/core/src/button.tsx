import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { classNames } from '@nexui/utils';

export type NexuiButtonProps = {
  children?: ReactNode;
  variant?: 'primary' | 'secondary';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function NexuiButton({
  children,
  className,
  variant = 'secondary',
  style,
  type = 'button',
  ...rest
}: NexuiButtonProps) {
  const mergedStyle: CSSProperties = {
    borderRadius: 'var(--nexui-radius-md)',
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-4)',
    border:
      variant === 'primary'
        ? '1px solid var(--nexui-color-primary-600)'
        : '1px solid var(--nexui-color-border-default)',
    background:
      variant === 'primary'
        ? 'var(--nexui-color-primary-600)'
        : 'var(--nexui-color-surface-canvas)',
    color:
      variant === 'primary'
        ? 'var(--nexui-color-text-on-primary)'
        : 'var(--nexui-color-text-primary)',
    cursor: rest.disabled === true ? 'not-allowed' : 'pointer',
    ...style,
  };

  return (
    <button
      type={type}
      className={classNames('nexui-button', className)}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </button>
  );
}

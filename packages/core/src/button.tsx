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
    borderRadius: 'var(--nexui-radius-md, 8px)',
    padding: 'var(--nexui-space-2, 8px) var(--nexui-space-4, 16px)',
    border:
      variant === 'primary'
        ? '1px solid var(--nexui-color-brand-primary, #2563eb)'
        : '1px solid var(--nexui-color-border-default, #e5e5e5)',
    background:
      variant === 'primary'
        ? 'var(--nexui-color-brand-primary, #2563eb)'
        : 'var(--nexui-color-background-canvas, #ffffff)',
    color:
      variant === 'primary'
        ? 'var(--nexui-color-brand-onPrimary, #ffffff)'
        : 'var(--nexui-color-foreground-default, #0a0a0a)',
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

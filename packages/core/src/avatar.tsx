import { classNames } from '@nexui/utils';
import {
  forwardRef,
  useCallback,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type ReactNode,
  type SyntheticEvent,
} from 'react';

export type NexuiAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type NexuiAvatarProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> & {
  /** Shown when `src` is absent or fails to load; keep short (e.g. initials). */
  fallback: ReactNode;
  size?: NexuiAvatarSize;
  /** Names the entity when only fallback is shown (1.1.1); defaults to string `fallback` when it is text. */
  'aria-label'?: string;
};

const DIM: Record<NexuiAvatarSize, string> = {
  sm: 'var(--nexui-spacing-8)',
  md: 'var(--nexui-spacing-10)',
  lg: 'var(--nexui-spacing-12)',
  xl: 'var(--nexui-spacing-16)',
};

const FONT: Record<NexuiAvatarSize, string> = {
  sm: 'var(--nexui-typography-font-size-xs)',
  md: 'var(--nexui-typography-font-size-sm)',
  lg: 'var(--nexui-typography-font-size-md)',
  xl: 'var(--nexui-typography-font-size-lg)',
};

const shell = (size: NexuiAvatarSize): CSSProperties => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: DIM[size],
  height: DIM[size],
  borderRadius: 'var(--nexui-radius-full)',
  overflow: 'hidden',
  flexShrink: 0,
  backgroundColor: 'var(--nexui-color-surface-sunken)',
  color: 'var(--nexui-color-text-secondary)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: FONT[size],
  fontWeight: 'var(--nexui-typography-font-weight-semibold)',
  lineHeight: 'var(--nexui-typography-line-height-tight)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
});

const imgFill: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

/**
 * Avatar image with token-sized frame and textual fallback.
 *
 * ARIA / WCAG 2.1 AA:
 * - When an image loads, meaningful `alt` describes the person or entity (1.1.1 Non-text Content).
 * - When only fallback is visible we expose `role="img"` with `aria-label` (string fallback or explicit `aria-label`) so non-text initials still have a name (1.1.1).
 * - The avatar is not focusable (2.1.1).
 *
 * Keyboard:
 * - Non-interactive; no keyboard operations.
 */
export const NexuiAvatar = forwardRef<HTMLDivElement, NexuiAvatarProps>(function NexuiAvatar(
  { className, src, alt = '', fallback, size = 'md', style, onError, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const [failed, setFailed] = useState(false);
  const showImg = Boolean(src) && !failed;
  const fallbackText = typeof fallback === 'string' || typeof fallback === 'number' ? String(fallback) : undefined;
  const imgLabel = ariaLabel ?? fallbackText;

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      setFailed(true);
      onError?.(e);
    },
    [onError],
  );

  return (
    <div
      ref={ref}
      className={classNames('nexui-avatar', className)}
      style={{ ...shell(size), ...style }}
      role={showImg ? undefined : 'img'}
      aria-label={showImg ? undefined : imgLabel}
    >
      {showImg ? (
        <img src={src} alt={alt} style={imgFill} onError={handleError} {...rest} />
      ) : null}
      {!showImg ? <span aria-hidden>{fallback}</span> : null}
    </div>
  );
});

NexuiAvatar.displayName = 'NexuiAvatar';

// DECISION LOG
// Problem: avatars need predictable sizes, image coverage, and accessible handling when assets fail.
// Options considered: (1) always background-image; (2) `next/image`-style wrapper; (3) `<img>` + fallback span in a sized div.
// Why I chose this: div wrapper allows ref forwarding for layout while keeping `alt` on the real image when rendered.
// Trade-off: empty `alt` removes the image from the a11y tree entirely—consumers should supply meaningful `alt` whenever they provide `src`.

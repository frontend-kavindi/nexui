import { FocusTrap } from 'focus-trap-react';
import {
  forwardRef,
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

export type NexuiModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

export type NexuiModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  size?: NexuiModalSize;
  closeOnBackdropClick?: boolean;
};

const PANEL_WIDTH: Record<NexuiModalSize, CSSProperties> = {
  sm: {
    width: 'min(calc(100% - var(--nexui-spacing-8)), var(--nexui-breakpoint-sm))',
    maxHeight: 'min(90vh, calc(100% - var(--nexui-spacing-10)))',
  },
  md: {
    width: 'min(calc(100% - var(--nexui-spacing-8)), var(--nexui-breakpoint-md))',
    maxHeight: 'min(90vh, calc(100% - var(--nexui-spacing-10)))',
  },
  lg: {
    width: 'min(calc(100% - var(--nexui-spacing-8)), var(--nexui-breakpoint-lg))',
    maxHeight: 'min(90vh, calc(100% - var(--nexui-spacing-10)))',
  },
  fullscreen: {
    width: 'calc(100% - var(--nexui-spacing-6))',
    height: 'calc(100% - var(--nexui-spacing-6))',
    maxHeight: 'none',
    borderRadius: 'var(--nexui-radius-none)',
  },
};

const backdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 'var(--nexui-z-index-modal-backdrop)',
  backgroundColor: 'var(--nexui-color-overlay-scrim)',
};

const layerStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 'var(--nexui-z-index-modal)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--nexui-spacing-6)',
  pointerEvents: 'none',
};

const panelBase: CSSProperties = {
  pointerEvents: 'auto',
  backgroundColor: 'var(--nexui-color-surface-overlay)',
  color: 'var(--nexui-color-text-primary)',
  boxShadow: 'var(--nexui-shadow-xl)',
  borderRadius: 'var(--nexui-radius-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-4)',
  padding: 'var(--nexui-spacing-6)',
  overflow: 'auto',
};

/**
 * Modal dialog with focus trap, scroll lock, backdrop, and token-based motion.
 *
 * ARIA / WCAG 2.1 AA:
 * - `role="dialog"` + `aria-modal="true"` identifies a modal surface (4.1.2 Name, Role, Value).
 * - `aria-labelledby` ties to the title element for an accessible name (4.1.2).
 * - Focus trap keeps keyboard focus inside while `open` (2.4.3 Focus Order).
 * - Backdrop is outside the trapped tree but participates in dismissal via `clickOutsideDeactivates`.
 *
 * Keyboard:
 * - **Tab / Shift+Tab**: move between controls inside the dialog while trapped.
 * - **Escape**: closes via focus-trap deactivate → `onOpenChange(false)`.
 */
export const NexuiModal = forwardRef<HTMLDivElement, NexuiModalProps>(function NexuiModal(
  {
    open,
    onOpenChange,
    title,
    children,
    size = 'md',
    closeOnBackdropClick = true,
  },
  ref,
) {
  const titleId = useId();
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!rendered) return null;

  const exiting = !open;

  const panelMotion: CSSProperties = {
    animationName: exiting ? 'nexui-modal-exit' : 'nexui-modal-enter',
    animationDuration: 'var(--nexui-motion-duration-slow)',
    animationTimingFunction: exiting
      ? 'var(--nexui-motion-easing-ease-in)'
      : 'var(--nexui-motion-easing-ease-out)',
    animationFillMode: 'forwards',
  };

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdropClick) return;
    if (event.target === event.currentTarget) {
      onOpenChange(false);
    }
  };

  return createPortal(
    <>
      <div style={backdropStyle} onMouseDown={handleBackdropMouseDown} />
      <FocusTrap
        active={open}
        focusTrapOptions={{
          preventScroll: true,
          escapeDeactivates: true,
          clickOutsideDeactivates: closeOnBackdropClick,
          fallbackFocus: () => document.body,
          onDeactivate: () => { onOpenChange(false); },
        }}
      >
        <div style={layerStyle}>
          <div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            style={{ ...panelBase, ...PANEL_WIDTH[size], ...panelMotion }}
            onAnimationEnd={(e) => {
              if (e.target !== e.currentTarget) return;
              if (exiting) setRendered(false);
            }}
          >
            <header
              style={{
                fontFamily: 'var(--nexui-typography-font-family-sans)',
                fontSize: 'var(--nexui-typography-font-size-xl)',
                fontWeight: 'var(--nexui-typography-font-weight-semibold)',
              }}
            >
              <h2
                id={titleId}
                style={{
                  marginBlock: 0,
                  marginInline: 0,
                }}
              >
                {title}
              </h2>
            </header>
            <div style={{ flex: '1 1 auto' }}>{children}</div>
          </div>
        </div>
      </FocusTrap>
    </>,
    document.body,
  );
});

NexuiModal.displayName = 'NexuiModal';

// DECISION LOG
// Problem: coordinated backdrop clicks, focus restoration, scroll lock, and motion without accessibility gaps.
// Options considered: (1) native `<dialog>`; (2) headless-ui pattern with manual focus; (3) portal + `focus-trap-react`.
// Why I chose this: `focus-trap-react` centralizes WCAG-sensitive focus rules; portal guarantees predictable z-index stacking with tokens.
// Trade-off: slightly larger bundle than a thin `<dialog>` wrapper; native dialogs remain an option for future “simple alert” subset.

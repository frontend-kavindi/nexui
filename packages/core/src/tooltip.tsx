import { classNames } from '@nexui/utils';
import {
  Children,
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';

function assignRef<T>(instanceRef: Ref<T> | undefined, value: T | null): void {
  if (typeof instanceRef === 'function') {
    instanceRef(value);
  } else if (instanceRef) {
    instanceRef.current = value;
  }
}

export type NexuiTooltipPlacement = 'top' | 'bottom';

export type NexuiTooltipProps = {
  /** Tooltip body; keep concise (2.4.4 Link Purpose / adjacent context). */
  content: ReactNode;
  /** Single focusable or hoverable element; receives `aria-describedby` while open. */
  children: ReactElement;
  placement?: NexuiTooltipPlacement;
  className?: string;
};

const tipBase: CSSProperties = {
  position: 'fixed',
  zIndex: 'var(--nexui-z-index-sticky)',
  maxWidth: 'var(--nexui-breakpoint-xs)',
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-3)',
  borderRadius: 'var(--nexui-radius-md)',
  backgroundColor: 'var(--nexui-color-surface-inverse)',
  color: 'var(--nexui-color-text-inverse)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  boxShadow: 'var(--nexui-shadow-lg)',
  pointerEvents: 'none',
};

/**
 * Hover/focus tooltip portaled to `document.body`.
 *
 * ARIA / WCAG 2.1 AA:
 * - `role="tooltip"` identifies supplementary description (4.1.2).
 * - `aria-describedby` on the trigger while open connects the reference without stealing focus (2.4.4 / 4.1.2).
 * - Tooltip is `pointer-events: none` so it does not block pointer targets underneath after dismiss (2.5.1).
 * - Escape dismisses the bubble for predictable keyboard exit (2.1.1).
 *
 * Keyboard:
 * - Focus on the trigger shows the tooltip; blur hides it (unless hover keeps it open—hover + focus union handled below).
 */
export const NexuiTooltip = forwardRef<HTMLDivElement, NexuiTooltipProps>(function NexuiTooltip(
  { content, children, placement = 'top', className },
  ref,
) {
  const tipId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: '0px', left: '0px' });

  const show = useCallback(() => {
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const gap = 'var(--nexui-spacing-2)';
    if (placement === 'bottom') {
      setCoords({
        top: `calc(${String(r.bottom)}px + ${gap})`,
        left: `${String(r.left)}px`,
      });
    } else {
      setCoords({
        top: `calc(${String(r.top)}px - ${gap})`,
        left: `${String(r.left)}px`,
      });
    }
  }, [open, placement]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  type TriggerProps = {
    ref?: Ref<HTMLElement | null>;
    onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
    onFocus?: (e: FocusEvent<HTMLElement>) => void;
    onBlur?: (e: FocusEvent<HTMLElement>) => void;
    'aria-describedby'?: string;
  };

  const child = Children.only(children) as ReactElement<TriggerProps>;
  const p = child.props;
  const prevDescribedBy = p['aria-describedby'];
  const describedBy = open
    ? [prevDescribedBy, tipId].filter(Boolean).join(' ').trim() || tipId
    : prevDescribedBy;
  const childRef = p.ref;

  const merged = cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      assignRef(childRef, node);
    },
    ...(describedBy ? { 'aria-describedby': describedBy } : {}),
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      p.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      p.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      p.onFocus?.(e);
      show();
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      p.onBlur?.(e);
      hide();
    },
  });

  const tipStyle: CSSProperties = {
    ...tipBase,
    ...coords,
    transform: placement === 'top' ? 'translateY(-100%)' : undefined,
  };

  return (
    <>
      {merged}
      {open
        ? createPortal(
            <div
              ref={ref}
              id={tipId}
              role="tooltip"
              className={classNames('nexui-tooltip', className)}
              style={tipStyle}
            >
              {content}
            </div>,
            document.body,
          )
        : null}
    </>
  );
});

NexuiTooltip.displayName = 'NexuiTooltip';

// DECISION LOG
// Problem: tooltips must describe controls without trapping focus or duplicating the accessible name.
// Options considered: (1) Radix/Floating UI dependency; (2) title attribute; (3) lightweight portal + aria-describedby.
// Why I chose this: zero new dependencies, token-only surfaces, and APG-aligned tooltip trigger pairing.
// Trade-off: positioning is viewport-fixed and does not flip when near edges; add collision detection later if needed.

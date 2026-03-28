import { tokens } from '@nexui/themes';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

export type NexuiToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type NexuiToastTone = 'default' | 'success' | 'error' | 'warning';

export type NexuiToastDurationPreset = 'fast' | 'normal' | 'slow';

export type NexuiToastInput = {
  title: string;
  description?: string;
  position?: NexuiToastPosition;
  tone?: NexuiToastTone;
  duration?: NexuiToastDurationPreset;
  id?: string;
};

type ToastRecord = NexuiToastInput & {
  id: string;
  createdAt: number;
};

type Action =
  | { type: 'push'; payload: ToastRecord }
  | { type: 'dismiss'; id: string }
  | { type: 'clear' };

function reducer(state: ToastRecord[], action: Action): ToastRecord[] {
  if (action.type === 'push') return [...state, action.payload];
  if (action.type === 'dismiss') return state.filter((t) => t.id !== action.id);
  return [];
}

function createId(): string {
  return `nexui-toast-${Math.random().toString(36).slice(2)}`;
}

type ToastCtx = {
  toasts: ToastRecord[];
  push: (toast: NexuiToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

const REGION: Record<
  NexuiToastPosition,
  Pick<CSSProperties, 'top' | 'bottom' | 'left' | 'right' | 'transform' | 'alignItems'>
> = {
  'top-left': {
    top: 'var(--nexui-spacing-4)',
    left: 'var(--nexui-spacing-4)',
    alignItems: 'flex-start',
  },
  'top-center': {
    top: 'var(--nexui-spacing-4)',
    left: '50%',
    transform: 'translateX(-50%)',
    alignItems: 'center',
  },
  'top-right': {
    top: 'var(--nexui-spacing-4)',
    right: 'var(--nexui-spacing-4)',
    alignItems: 'flex-end',
  },
  'bottom-left': {
    bottom: 'var(--nexui-spacing-4)',
    left: 'var(--nexui-spacing-4)',
    alignItems: 'flex-start',
  },
  'bottom-center': {
    bottom: 'var(--nexui-spacing-4)',
    left: '50%',
    transform: 'translateX(-50%)',
    alignItems: 'center',
  },
  'bottom-right': {
    bottom: 'var(--nexui-spacing-4)',
    right: 'var(--nexui-spacing-4)',
    alignItems: 'flex-end',
  },
};

const DURATION_VAR: Record<NexuiToastDurationPreset, string> = {
  fast: 'var(--nexui-motion-duration-toast-dismiss-fast)',
  normal: 'var(--nexui-motion-duration-toast-dismiss-normal)',
  slow: 'var(--nexui-motion-duration-toast-dismiss-slow)',
};

function toastDismissMs(preset: NexuiToastDurationPreset): number {
  const map = tokens.theme.light.motion.duration;
  const key =
    preset === 'fast'
      ? 'toastDismissFast'
      : preset === 'slow'
        ? 'toastDismissSlow'
        : 'toastDismissNormal';
  return Number.parseInt(map[key].replace('ms', ''), 10);
}

function toneBorder(tone: NexuiToastTone): string {
  if (tone === 'success') return 'var(--nexui-color-semantic-success-border)';
  if (tone === 'error') return 'var(--nexui-color-semantic-error-border)';
  if (tone === 'warning') return 'var(--nexui-color-semantic-warning-border)';
  return 'var(--nexui-color-border-default)';
}

/**
 * Z-index strategy:
 * - All toast regions use `z-index: var(--nexui-z-index-toast)` so toasts reliably appear **above** modals (`--nexui-z-index-modal*`) while staying below future “critical alert” layers if you extend the token ladder.
 * - Within a region we rely on **DOM order** (later siblings paint above) instead of per-toast z-index math, avoiding magic numbers and keeping dismissal animations simple.
 * - This ordering is intentional: designers can reason about “toast layer vs modal layer” purely from tokens.
 */

function ToastView({
  toast,
  onDismiss,
}: {
  toast: ToastRecord;
  onDismiss: (id: string) => void;
}) {
  const preset = toast.duration ?? 'normal';
  const durationVar = DURATION_VAR[preset];

  const card: CSSProperties = {
    pointerEvents: 'auto',
    minWidth: 'min(100%, var(--nexui-breakpoint-sm))',
    borderRadius: 'var(--nexui-radius-md)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: toneBorder(toast.tone ?? 'default'),
    backgroundColor: 'var(--nexui-color-surface-overlay)',
    color: 'var(--nexui-color-text-primary)',
    boxShadow: 'var(--nexui-shadow-lg)',
    paddingInline: 'var(--nexui-spacing-4)',
    paddingBlock: 'var(--nexui-spacing-3)',
    marginBlockEnd: 'var(--nexui-spacing-2)',
  };

  const titleStyle: CSSProperties = {
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-md)',
    fontWeight: 'var(--nexui-typography-font-weight-semibold)',
    margin: 0,
  };

  const bodyStyle: CSSProperties = {
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
    color: 'var(--nexui-color-text-secondary)',
    margin: 0,
    marginBlockStart: 'var(--nexui-spacing-1)',
  };

  const barTrack: CSSProperties = {
    marginBlockStart: 'var(--nexui-spacing-2)',
    height: 'var(--nexui-spacing-1)',
    backgroundColor: 'var(--nexui-color-surface-sunken)',
    borderRadius: 'var(--nexui-radius-full)',
    overflow: 'hidden',
  };

  const barFill: CSSProperties = {
    height: '100%',
    backgroundColor: 'var(--nexui-color-primary-500)',
    transformOrigin: 'left center',
    animationName: 'nexui-toast-progress',
    animationDuration: durationVar,
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards',
  };

  return (
    <article aria-labelledby={`${toast.id}-title`} style={card}>
      <h2 id={`${toast.id}-title`} style={titleStyle}>
        {toast.title}
      </h2>
      {toast.description ? (
        <p style={bodyStyle}>{toast.description}</p>
      ) : null}
      <div style={barTrack} aria-hidden>
        <div style={barFill} />
      </div>
      <button
        type="button"
        onClick={() => { onDismiss(toast.id); }}
        style={{
          marginBlockStart: 'var(--nexui-spacing-2)',
          fontSize: 'var(--nexui-typography-font-size-sm)',
          border: 'none',
          background: 'transparent',
          color: 'var(--nexui-color-text-secondary)',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        Dismiss
      </button>
    </article>
  );
}

function ToastRegions({
  toasts,
  onDismiss,
}: {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
}) {
  const positions = useMemo(() => {
    const buckets: Record<NexuiToastPosition, ToastRecord[]> = {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': [],
    };
    for (const toast of toasts) {
      const p = toast.position ?? 'bottom-right';
      buckets[p].push(toast);
    }
    return buckets;
  }, [toasts]);

  return (
    <>
      {(Object.keys(positions) as NexuiToastPosition[]).map((position) => {
        const stack = positions[position];
        if (stack.length === 0) return null;
        const layout = REGION[position];
        const colStyle: CSSProperties = {
          position: 'fixed',
          ...layout,
          zIndex: 'var(--nexui-z-index-toast)',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
          maxHeight: 'calc(100% - var(--nexui-spacing-8))',
          overflow: 'auto',
        };
        return (
          <section
            key={position}
            style={colStyle}
            aria-label={`Notifications ${position}`}
            aria-live="polite"
            aria-relevant="additions text"
          >
            {stack.map((t) => (
              <ToastView key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
          </section>
        );
      })}
    </>
  );
}

/**
 * Provider that portals toast regions to `document.body`.
 *
 * ARIA / WCAG 2.1 AA:
 * - Each region exposes `aria-live="polite"` so announcements do not aggressively interrupt users (4.1.3 Status Messages).
 * - `aria-relevant="additions text"` limits chatter while still announcing new toasts.
 * - Each toast uses `aria-labelledby` pointing at the title (`role="heading"` default for `h2`) for an accessible name (4.1.2).
 *
 * Keyboard:
 * - **Tab** reaches the dismiss control inside each toast; **Enter/Space** activates dismissal.
 */
export type NexuiToastProviderProps = { children: ReactNode };

export const NexuiToastProvider = forwardRef<HTMLDivElement, NexuiToastProviderProps>(
  function NexuiToastProvider({ children }, ref) {
    const [toasts, dispatch] = useReducer(reducer, []);
    const timers = useRef(new Map<string, ReturnType<typeof window.setTimeout>>());

    const dismiss = useCallback((id: string) => {
      const handle = timers.current.get(id);
      if (handle !== undefined) window.clearTimeout(handle);
      timers.current.delete(id);
      dispatch({ type: 'dismiss', id });
    }, []);

    const push = useCallback(
      (toast: NexuiToastInput) => {
        const id = toast.id ?? createId();
        const record: ToastRecord = {
          ...toast,
          id,
          position: toast.position ?? 'bottom-right',
          tone: toast.tone ?? 'default',
          duration: toast.duration ?? 'normal',
          createdAt: Date.now(),
        };
        dispatch({ type: 'push', payload: record });
        const preset = record.duration ?? 'normal';
        const t = window.setTimeout(() => { dismiss(id); }, toastDismissMs(preset));
        timers.current.set(id, t);
        return id;
      },
      [dismiss],
    );

    const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);

    return (
      <ToastContext.Provider value={value}>
        <div ref={ref} style={{ display: 'contents' }}>
          {children}
        </div>
        {createPortal(<ToastRegions toasts={toasts} onDismiss={dismiss} />, document.body)}
      </ToastContext.Provider>
    );
  },
);

NexuiToastProvider.displayName = 'NexuiToastProvider';

export function useNexuiToast(): ToastCtx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useNexuiToast must be used within NexuiToastProvider');
  return ctx;
}

// DECISION LOG
// Problem: stack multiple transient notifications without stealing focus from modal workflows while still exposing polite SR updates.
// Options considered: (1) Sonner-style imperative singleton; (2) Radix toast primitive; (3) minimal context + fixed regions.
// Why I chose this: keeps bundle small, encodes the six requested anchor points, and uses tokens for motion/shadow/z-index parity with Modal.
// Trade-off: auto-dismiss duration uses a coarse heuristic (preset→ms) until we expose a generated duration token map on the JS side.

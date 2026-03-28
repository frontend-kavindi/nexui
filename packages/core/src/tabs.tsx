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
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

export type NexuiTabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export type NexuiTabProps = {
  value: string;
  children?: ReactNode;
  disabled?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export type NexuiTabPanelProps = {
  value: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

type TabsCtx = {
  id: string;
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = createContext<TabsCtx | null>(null);

function useTabs(component: string): TabsCtx {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`${component} must be used within NexuiTabs`);
  }
  return ctx;
}

const stack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--nexui-spacing-3)',
};

const tabListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 'var(--nexui-spacing-1)',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'var(--nexui-color-border-default)',
};

function tabStyle(selected: boolean): CSSProperties {
  return {
    position: 'relative',
    marginBottom: '-1px',
    paddingBlock: 'var(--nexui-spacing-2)',
    paddingInline: 'var(--nexui-spacing-4)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: selected ? 'var(--nexui-color-border-default)' : 'transparent',
    borderBottomColor: selected ? 'var(--nexui-color-surface-canvas)' : 'transparent',
    borderTopLeftRadius: 'var(--nexui-radius-md)',
    borderTopRightRadius: 'var(--nexui-radius-md)',
    backgroundColor: selected ? 'var(--nexui-color-surface-canvas)' : 'transparent',
    color: selected ? 'var(--nexui-color-text-primary)' : 'var(--nexui-color-text-secondary)',
    fontFamily: 'var(--nexui-typography-font-family-sans)',
    fontSize: 'var(--nexui-typography-font-size-sm)',
    fontWeight: selected ? 'var(--nexui-typography-font-weight-semibold)' : 'var(--nexui-typography-font-weight-medium)',
    lineHeight: 'var(--nexui-typography-line-height-normal)',
    cursor: 'pointer',
  };
}

const panelStyle: CSSProperties = {
  paddingBlock: 'var(--nexui-spacing-2)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-primary)',
};

/**
 * Tabbed interface shell with controlled or uncontrolled selection.
 *
 * ARIA / WCAG 2.1 AA:
 * - `NexuiTabList` exposes `role="tablist"` and arrow-key handling moves focus among enabled tabs only (2.1.1).
 * - Each tab uses `role="tab"` with `aria-selected`, `tabIndex` roving, and `aria-controls` pointing at its panel (4.1.2).
 * - Panels use `role="tabpanel"` with `aria-labelledby` referencing the tab id and `hidden` when inactive (4.1.2).
 *
 * Keyboard:
 * - ArrowLeft / ArrowRight move focus between tabs; Home / End jump to first/last enabled tab.
 * - Tab moves focus into the active panel content after the tab list (native tab order).
 */
export const NexuiTabs = forwardRef<HTMLDivElement, NexuiTabsProps>(function NexuiTabs(
  { value: valueProp, defaultValue = '', onValueChange, children, className, ...rest },
  ref,
) {
  const uid = useId();
  const baseId = `nexui-tabs-${uid}`;
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internal;

  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) {
        setInternal(v);
      }
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );

  const ctx = useMemo((): TabsCtx => ({ id: baseId, value, setValue }), [baseId, value, setValue]);

  return (
    <TabsContext.Provider value={ctx}>
      <div ref={ref} className={classNames('nexui-tabs', className)} style={stack} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

NexuiTabs.displayName = 'NexuiTabs';

export const NexuiTabList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function NexuiTabList(
  { children, className, onKeyDown, ...rest },
  ref,
) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') {
      onKeyDown?.(e);
      return;
    }
    const root = e.currentTarget;
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')];
    if (tabs.length === 0) {
      onKeyDown?.(e);
      return;
    }
    const active = document.activeElement;
    let idx = tabs.indexOf(active as HTMLButtonElement);
    if (idx < 0) {
      idx = 0;
    }
    e.preventDefault();
    if (e.key === 'Home') {
      tabs[0]?.focus();
      onKeyDown?.(e);
      return;
    }
    if (e.key === 'End') {
      tabs[tabs.length - 1]?.focus();
      onKeyDown?.(e);
      return;
    }
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const next = (idx + delta + tabs.length) % tabs.length;
    tabs[next]?.focus();
    onKeyDown?.(e);
  };

  return (
    <div
      ref={ref}
      role="tablist"
      className={classNames('nexui-tablist', className)}
      style={tabListStyle}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
});

NexuiTabList.displayName = 'NexuiTabList';

export const NexuiTab = forwardRef<HTMLButtonElement, NexuiTabProps>(function NexuiTab(
  { value, children, disabled, className, style, onClick, ...rest },
  ref,
) {
  const ctx = useTabs('NexuiTab');
  const selected = ctx.value === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`${ctx.id}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${ctx.id}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={classNames('nexui-tab', className)}
      style={{ ...tabStyle(selected), ...style }}
      onClick={(e) => {
        ctx.setValue(value);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
});

NexuiTab.displayName = 'NexuiTab';

export const NexuiTabPanel = forwardRef<HTMLDivElement, NexuiTabPanelProps>(function NexuiTabPanel(
  { value, children, className, style, hidden, ...rest },
  ref,
) {
  const ctx = useTabs('NexuiTabPanel');
  const selected = ctx.value === value;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${ctx.id}-panel-${value}`}
      aria-labelledby={`${ctx.id}-tab-${value}`}
      hidden={hidden ?? !selected}
      className={classNames('nexui-tabpanel', className)}
      style={{ ...panelStyle, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
});

NexuiTabPanel.displayName = 'NexuiTabPanel';

// DECISION LOG
// Problem: tabs need roving tabindex, tablist/tabpanel wiring, and token styling without a headless dependency.
// Options considered: (1) Radix tabs primitive; (2) single mega-component API; (3) compound components + minimal context.
// Why I chose this: mirrors the existing Modal/Select composition style and keeps tree-shaking friendly exports.
// Trade-off: consumers must keep `value` strings in sync between `NexuiTab` and `NexuiTabPanel`; codegen helpers could reduce drift later.

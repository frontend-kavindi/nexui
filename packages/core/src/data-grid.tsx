import { classNames } from '@nexui/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

export type NexuiDataGridColumn<Row> = {
  id: string;
  header: ReactNode;
  width: number;
  frozen?: boolean;
  accessor: (row: Row) => unknown;
};

export type NexuiDataGridProps<Row extends Record<string, unknown>> = {
  data: readonly Row[];
  columns: ReadonlyArray<NexuiDataGridColumn<Row>>;
  getRowId: (row: Row, index: number) => string;
  frozenColumnCount: number;
  rowHeight: number;
  gridHeight: string;
  onCellChange?: (rowId: string, columnId: string, value: string) => void;
  className?: string;
};

const border: CSSProperties = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--nexui-color-border-default)',
  backgroundColor: 'var(--nexui-color-surface-canvas)',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
};

function cellHeaderAriaLabel(header: ReactNode): string {
  if (header === null || header === undefined) return '';
  if (typeof header === 'string' || typeof header === 'number' || typeof header === 'boolean') {
    return String(header);
  }
  return '';
}

function formatCellValue(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'bigint') {
    return String(val);
  }
  return '';
}

function cellBox(kind: 'header' | 'body'): CSSProperties {
  return {
    ...border,
    display: 'flex',
    alignItems: 'center',
    paddingInline: 'var(--nexui-spacing-2)',
    paddingBlock: 'var(--nexui-spacing-1)',
    boxSizing: 'border-box',
    overflow: 'hidden',
    outline: 'none',
    backgroundColor: kind === 'header' ? 'var(--nexui-color-surface-raised)' : 'var(--nexui-color-surface-canvas)',
    fontWeight: kind === 'header' ? 'var(--nexui-typography-font-weight-semibold)' : 'var(--nexui-typography-font-weight-regular)',
  };
}

export const NexuiDataGrid = forwardRef<HTMLDivElement, NexuiDataGridProps<Record<string, unknown>>>(function NexuiDataGrid(
  {
    data,
    columns,
    getRowId,
    frozenColumnCount,
    rowHeight,
    gridHeight,
    onCellChange,
    className,
  }: NexuiDataGridProps<Record<string, unknown>>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const gridId = useId();
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const hBodyRef = useRef<HTMLDivElement>(null);
  const hHeadRef = useRef<HTMLDivElement>(null);

  const [widths, setWidths] = useState<Record<string, number>>(() =>
    Object.fromEntries(columns.map((c) => [c.id, c.width])),
  );
  const [editing, setEditing] = useState<{ row: number; col: string } | null>(null);
  const [focus, setFocus] = useState({ row: 0, col: 0 });

  const frozenCols = useMemo(() => columns.slice(0, frozenColumnCount), [columns, frozenColumnCount]);
  const scrollCols = useMemo(() => columns.slice(frozenColumnCount), [columns, frozenColumnCount]);

  const frozenWidth = useMemo(
    () => frozenCols.reduce((s, c) => s + (widths[c.id] ?? c.width), 0),
    [frozenCols, widths],
  );

  const rowCount = data.length;
  const colCount = columns.length;

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => bodyScrollRef.current,
    estimateSize: () => rowHeight,
    overscan: 12,
  });

  const scrollColVirtualizer = useVirtualizer({
    horizontal: true,
    count: scrollCols.length,
    getScrollElement: () => hBodyRef.current,
    estimateSize: (index) => {
      const c = scrollCols[index];
      if (!c) return 48;
      return widths[c.id] ?? c.width;
    },
    overscan: 4,
  });

  useEffect(() => {
    const body = hBodyRef.current;
    const head = hHeadRef.current;
    if (!body || !head) return;
    const sync = () => {
      head.scrollLeft = body.scrollLeft;
    };
    body.addEventListener('scroll', sync);
    sync();
    return () => {
      body.removeEventListener('scroll', sync);
    };
  }, [scrollColVirtualizer]);

  const startResize = useCallback((columnId: string, startX: number, startW: number) => {
    const onMove = (e: MouseEvent) => {
      const next = Math.max(48, startW + (e.clientX - startX));
      setWidths((w) => ({ ...w, [columnId]: next }));
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (editing) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setFocus((f) => ({ ...f, col: Math.min(colCount - 1, f.col + 1) }));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setFocus((f) => ({ ...f, col: Math.max(0, f.col - 1) }));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocus((f) => ({ ...f, row: Math.min(rowCount - 1, f.row + 1) }));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocus((f) => ({ ...f, row: Math.max(0, f.row - 1) }));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const col = columns[focus.col];
      if (col && onCellChange) {
        setEditing({ row: focus.row, col: col.id });
      }
    }
  };

  const shell: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: gridHeight,
    outline: 'none',
  };

  return (
    <div
      ref={ref}
      className={classNames('nexui-data-grid', className)}
      role="grid"
      aria-rowcount={rowCount + 1}
      aria-colcount={colCount}
      id={gridId}
      style={shell}
      tabIndex={0}
      onKeyDown={onGridKeyDown}
    >
      <div
        role="row"
        aria-rowindex={1}
        style={{ display: 'flex', flexDirection: 'row', flexShrink: 0, borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'var(--nexui-color-border-default)' }}
      >
        <div style={{ width: frozenWidth, flexShrink: 0, display: 'flex', flexDirection: 'row' }}>
          {frozenCols.map((col, idx) => (
            <div
              key={col.id}
              role="columnheader"
              aria-colindex={idx + 1}
              style={{ ...cellBox('header'), width: widths[col.id] ?? col.width, position: 'relative' }}
            >
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{col.header}</span>
              <button
                type="button"
                aria-label={`Resize ${cellHeaderAriaLabel(col.header) || 'column'} column`}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: 'var(--nexui-spacing-2)',
                  height: '100%',
                  padding: 0,
                  border: 'none',
                  cursor: 'col-resize',
                  backgroundColor: 'transparent',
                }}
                onMouseDown={(e) => {
                  startResize(col.id, e.clientX, widths[col.id] ?? col.width);
                }}
              />
            </div>
          ))}
        </div>
        <div ref={hHeadRef} style={{ flex: 1, overflowX: 'hidden', overflowY: 'hidden' }}>
          <div style={{ width: scrollColVirtualizer.getTotalSize(), display: 'flex', flexDirection: 'row', position: 'relative', height: '100%' }}>
            {scrollColVirtualizer.getVirtualItems().map((vc) => {
              const col = scrollCols[vc.index];
              if (!col) return null;
              const gIdx = frozenColumnCount + vc.index;
              return (
                <div
                  key={col.id}
                  role="columnheader"
                  aria-colindex={gIdx + 1}
                  style={{
                    ...cellBox('header'),
                    position: 'absolute',
                    left: vc.start,
                    width: vc.size,
                    top: 0,
                    height: '100%',
                  }}
                >
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{col.header}</span>
                  <button
                    type="button"
                    aria-label={`Resize ${cellHeaderAriaLabel(col.header) || 'column'} column`}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      width: 'var(--nexui-spacing-2)',
                      height: '100%',
                      padding: 0,
                      border: 'none',
                      cursor: 'col-resize',
                      backgroundColor: 'transparent',
                    }}
                    onMouseDown={(e) => {
                      startResize(col.id, e.clientX, widths[col.id] ?? col.width);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div ref={bodyScrollRef} style={{ flex: 1, overflow: 'auto', position: 'relative', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: rowVirtualizer.getTotalSize(), position: 'relative' }}>
          <div style={{ width: frozenWidth, flexShrink: 0, position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((vRow) => {
              const row = data[vRow.index];
              if (!row) return null;
              const rowId = getRowId(row, vRow.index);
              return (
                <div
                  key={rowId}
                  role="row"
                  aria-rowindex={vRow.index + 2}
                  style={{
                    position: 'absolute',
                    top: vRow.start,
                    left: 0,
                    width: frozenWidth,
                    height: vRow.size,
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  {frozenCols.map((col, ci) => {
                    const isFocus = focus.row === vRow.index && focus.col === ci;
                    const isEdit = editing !== null && editing.row === vRow.index && editing.col === col.id;
                    const val = col.accessor(row);
                    const display = formatCellValue(val);
                    return (
                      <div
                        key={col.id}
                        role="gridcell"
                        aria-colindex={ci + 1}
                        tabIndex={isFocus ? 0 : -1}
                        style={{
                          ...cellBox('body'),
                          width: widths[col.id] ?? col.width,
                          borderTopWidth: '1px',
                          borderTopStyle: 'solid',
                          borderTopColor: 'var(--nexui-color-border-subtle)',
                        }}
                        onFocus={() => {
                          setFocus({ row: vRow.index, col: ci });
                        }}
                      >
                        {isEdit && onCellChange ? (
                          <input
                            aria-label={cellHeaderAriaLabel(col.header) || 'Cell'}
                            defaultValue={display}
                            style={{
                              width: '100%',
                              border: 'none',
                              outline: 'none',
                              font: 'inherit',
                              backgroundColor: 'transparent',
                            }}
                            onBlur={(e) => {
                              onCellChange(rowId, col.id, e.target.value);
                              setEditing(null);
                            }}
                            onKeyDown={(ke) => {
                              if (ke.key === 'Enter' || ke.key === 'Escape') {
                                ke.preventDefault();
                                if (ke.target instanceof HTMLInputElement) {
                                  ke.target.blur();
                                }
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          display
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div ref={hBodyRef} style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', position: 'relative', minWidth: 0 }}>
            <div
              style={{
                position: 'relative',
                width: scrollColVirtualizer.getTotalSize(),
                height: rowVirtualizer.getTotalSize(),
              }}
            >
              {rowVirtualizer.getVirtualItems().flatMap((vRow) =>
                scrollColVirtualizer.getVirtualItems().flatMap((vCol) => {
                  const row = data[vRow.index];
                  const col = scrollCols[vCol.index];
                  if (!row || !col) return [];
                  const rowId = getRowId(row, vRow.index);
                  const globalColIndex = frozenColumnCount + vCol.index;
                  const isFocus = focus.row === vRow.index && focus.col === globalColIndex;
                  const isEdit = editing !== null && editing.row === vRow.index && editing.col === col.id;
                  const val = col.accessor(row);
                  const display = formatCellValue(val);
                  return [
                    <div
                      key={`${rowId}-${col.id}`}
                      role="gridcell"
                      aria-rowindex={vRow.index + 2}
                      aria-colindex={globalColIndex + 1}
                      tabIndex={isFocus ? 0 : -1}
                      style={{
                        ...cellBox('body'),
                        position: 'absolute',
                        top: vRow.start,
                        left: vCol.start,
                        width: vCol.size,
                        height: vRow.size,
                        borderTopWidth: '1px',
                        borderTopStyle: 'solid',
                        borderTopColor: 'var(--nexui-color-border-subtle)',
                      }}
                      onFocus={() => {
                        setFocus({ row: vRow.index, col: globalColIndex });
                      }}
                    >
                      {isEdit && onCellChange ? (
                        <input
                          aria-label={cellHeaderAriaLabel(col.header) || 'Cell'}
                          defaultValue={display}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            font: 'inherit',
                            backgroundColor: 'transparent',
                          }}
                          onBlur={(e) => {
                            onCellChange(rowId, col.id, e.target.value);
                            setEditing(null);
                          }}
                          onKeyDown={(ke) => {
                            if (ke.key === 'Enter' || ke.key === 'Escape') {
                              ke.preventDefault();
                              if (ke.target instanceof HTMLInputElement) {
                                ke.target.blur();
                              }
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        display
                      )}
                    </div>,
                  ];
                }),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

NexuiDataGrid.displayName = 'NexuiDataGrid';

// DECISION LOG
// Problem: 100k+ rows require sub-linear DOM; column-heavy tables also need horizontal windowing.
// Options considered: (1) pagination-only; (2) react-window `FixedSizeGrid`; (3) TanStack Virtual dual 1D virtualizers.
// Why I chose this: `@tanstack/react-virtual` matches the monorepo’s TanStack direction, supports independent row + column virtualizers, and stays headless for token styling.
// Performance ceiling: work is O(visibleRows × visibleCols) for rendering; scroll handlers are throttled inside TanStack core—main limits are per-cell React cost and browser paint, not row count per se.
// Variable row heights: not enabled here—would use `measureElement` + `estimateSize` tuning and cache invalidation when row content changes (see TanStack Virtual dynamic examples).
// Scroll position on data refresh: consumers should keep stable `getRowId` and re-call `scrollToIndex` / preserve `scrollOffset` via virtualizer ref if needed; not wired internally to avoid guessing UX on sort/filter.
// Frozen columns: left strip is non–horizontally-virtualized (small N); scrollable region uses TanStack horizontal virtualization. Header horizontal track mirrors body `scrollLeft` so column headers align with cells.
// iOS Safari: horizontal `overflow-x: auto` uses native scrolling; sticky frozen columns were avoided in favor of a split pane to reduce known sticky+virtual bugs on older WebKit builds—trade-off: two panes must stay width-synced (header mirror uses `scrollLeft` sync).

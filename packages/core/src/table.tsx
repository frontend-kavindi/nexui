import { classNames } from '@nexui/utils';
import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';

const tableShell: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--nexui-typography-font-family-sans)',
  fontSize: 'var(--nexui-typography-font-size-sm)',
  lineHeight: 'var(--nexui-typography-line-height-normal)',
  color: 'var(--nexui-color-text-primary)',
};

const cell: CSSProperties = {
  paddingBlock: 'var(--nexui-spacing-2)',
  paddingInline: 'var(--nexui-spacing-3)',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'var(--nexui-color-border-default)',
  textAlign: 'start',
  verticalAlign: 'middle',
};

const headCell: CSSProperties = {
  ...cell,
  fontWeight: 'var(--nexui-typography-font-weight-semibold)',
  backgroundColor: 'var(--nexui-color-surface-raised)',
  borderBottomColor: 'var(--nexui-color-border-strong)',
};

export type NexuiTableProps = TableHTMLAttributes<HTMLTableElement>;

/**
 * Semantic data table with tokenized chrome.
 *
 * ARIA / WCAG 2.1 AA:
 * - Native `<table>` preserves table navigation in screen readers (1.3.1 Info and Relationships).
 * - Consumers should use `<th scope="col|row">` in header cells for explicit relationships (1.3.1).
 * - Caption, if provided via children, should be the first child `<caption>` for a programmatic title (1.3.1).
 *
 * Keyboard:
 * - Standard table navigation where supported by AT; no custom roving tabindex inside this primitive.
 */
export const NexuiTable = forwardRef<HTMLTableElement, NexuiTableProps>(function NexuiTable(
  { className, style, ...rest },
  ref,
) {
  return (
    <table ref={ref} className={classNames('nexui-table', className)} style={{ ...tableShell, ...style }} {...rest} />
  );
});

NexuiTable.displayName = 'NexuiTable';

export type NexuiTableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

export const NexuiTableHead = forwardRef<HTMLTableSectionElement, NexuiTableHeadProps>(
  function NexuiTableHead({ className, ...rest }, ref) {
    return <thead ref={ref} className={classNames('nexui-table-head', className)} {...rest} />;
  },
);

NexuiTableHead.displayName = 'NexuiTableHead';

export type NexuiTableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export const NexuiTableBody = forwardRef<HTMLTableSectionElement, NexuiTableBodyProps>(
  function NexuiTableBody({ className, ...rest }, ref) {
    return <tbody ref={ref} className={classNames('nexui-table-body', className)} {...rest} />;
  },
);

NexuiTableBody.displayName = 'NexuiTableBody';

export type NexuiTableRowProps = HTMLAttributes<HTMLTableRowElement>;

export const NexuiTableRow = forwardRef<HTMLTableRowElement, NexuiTableRowProps>(function NexuiTableRow(
  { className, ...rest },
  ref,
) {
  return <tr ref={ref} className={classNames('nexui-table-row', className)} {...rest} />;
});

NexuiTableRow.displayName = 'NexuiTableRow';

export type NexuiTableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement>;

export const NexuiTableHeaderCell = forwardRef<HTMLTableCellElement, NexuiTableHeaderCellProps>(
  function NexuiTableHeaderCell({ className, style, ...rest }, ref) {
    return (
      <th ref={ref} className={classNames('nexui-table-th', className)} style={{ ...headCell, ...style }} {...rest} />
    );
  },
);

NexuiTableHeaderCell.displayName = 'NexuiTableHeaderCell';

export type NexuiTableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export const NexuiTableCell = forwardRef<HTMLTableCellElement, NexuiTableCellProps>(function NexuiTableCell(
  { className, style, ...rest },
  ref,
) {
  return <td ref={ref} className={classNames('nexui-table-td', className)} style={{ ...cell, ...style }} {...rest} />;
});

NexuiTableCell.displayName = 'NexuiTableCell';

// DECISION LOG
// Problem: teams need a minimal semantic table without forcing a data-grid dependency.
// Options considered: (1) CSS grid divs; (2) role=table on divs; (3) native table elements.
// Why I chose this: native `<table>` preserves semantics and keeps keyboard/AT behavior predictable.
// Trade-off: complex layouts still belong in `NexuiDataGrid` for virtualization and editing.

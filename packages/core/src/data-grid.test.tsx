import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NexuiDataGrid } from './data-grid';
import { expectNoA11yViolations } from './test-axe';

const rows: Record<string, unknown>[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i),
  name: `Row ${String(i)}`,
}));

const columns = [
  {
    id: 'id',
    header: 'ID',
    width: 80,
    frozen: true,
    accessor: (r: Record<string, unknown>) => r.id,
  },
  {
    id: 'name',
    header: 'Name',
    width: 160,
    accessor: (r: Record<string, unknown>) => r.name,
  },
];

describe('NexuiDataGrid', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders grid role', () => {
    render(
      <NexuiDataGrid
        data={rows}
        columns={columns}
        getRowId={(r) => String(r.id)}
        frozenColumnCount={1}
        rowHeight={36}
        gridHeight="var(--nexui-breakpoint-sm)"
        onCellChange={() => {}}
      />,
    );
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const r = createRef<HTMLDivElement>();
    const fn = vi.fn();
    render(
      <NexuiDataGrid
        ref={r}
        data={rows}
        columns={columns}
        getRowId={(row) => String(row.id)}
        frozenColumnCount={1}
        rowHeight={36}
        gridHeight="200px"
        onCellChange={fn}
      />,
    );
    expect(r.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(
      <NexuiDataGrid
        data={rows}
        columns={columns}
        getRowId={(r) => String(r.id)}
        frozenColumnCount={1}
        rowHeight={36}
        gridHeight="240px"
      />,
    );
    await expectNoA11yViolations(container);
  });
});

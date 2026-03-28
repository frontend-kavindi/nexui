import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { NexuiDataGrid } from '@nexui/core';

function DataGridDemo() {
  const data = useMemo(
    () =>
      Array.from({ length: 5000 }, (_, i) => ({
        id: String(i),
        name: `User ${String(i)}`,
        email: `user${String(i)}@example.com`,
      })),
    [],
  );
  const [rows, setRows] = useState(data);

  return (
    <NexuiDataGrid
      data={rows}
      columns={[
        {
          id: 'id',
          header: 'ID',
          width: 72,
          frozen: true,
          accessor: (r) => r.id,
        },
        {
          id: 'name',
          header: 'Name',
          width: 160,
          accessor: (r) => r.name,
        },
        {
          id: 'email',
          header: 'Email',
          width: 220,
          accessor: (r) => r.email,
        },
      ]}
      getRowId={(r) => String(r.id)}
      frozenColumnCount={1}
      rowHeight={36}
      gridHeight="min(70vh, var(--nexui-breakpoint-md))"
      onCellChange={(rowId, columnId, value) => {
        setRows((prev) =>
          prev.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row)),
        );
      }}
    />
  );
}

const meta = {
  title: 'NexUI/DataGrid',
  component: DataGridDemo,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DataGridDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react';
import {
  NexuiTable,
  NexuiTableBody,
  NexuiTableCell,
  NexuiTableHead,
  NexuiTableHeaderCell,
  NexuiTableRow,
} from '@nexui/core';

function TableDemo() {
  return (
    <NexuiTable style={{ width: '100%', maxWidth: 'var(--nexui-breakpoint-md)' }}>
      <caption style={{ captionSide: 'top', textAlign: 'start', marginBottom: 'var(--nexui-spacing-2)' }}>Example</caption>
      <NexuiTableHead>
        <NexuiTableRow>
          <NexuiTableHeaderCell scope="col">Name</NexuiTableHeaderCell>
          <NexuiTableHeaderCell scope="col">Role</NexuiTableHeaderCell>
        </NexuiTableRow>
      </NexuiTableHead>
      <NexuiTableBody>
        <NexuiTableRow>
          <NexuiTableCell>Ada</NexuiTableCell>
          <NexuiTableCell>Admin</NexuiTableCell>
        </NexuiTableRow>
        <NexuiTableRow>
          <NexuiTableCell>Lin</NexuiTableCell>
          <NexuiTableCell>Editor</NexuiTableCell>
        </NexuiTableRow>
      </NexuiTableBody>
    </NexuiTable>
  );
}

const meta = {
  title: 'NexUI/Table',
  component: TableDemo,
} satisfies Meta<typeof TableDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

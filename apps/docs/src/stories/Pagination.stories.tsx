import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NexuiPagination } from '@nexui/core';

function PaginationDemo() {
  const [page, setPage] = useState(1);
  return <NexuiPagination page={page} pageCount={8} onPageChange={setPage} />;
}

const meta = {
  title: 'NexUI/Pagination',
  component: PaginationDemo,
} satisfies Meta<typeof PaginationDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

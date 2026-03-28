import type { Meta, StoryObj } from '@storybook/react';
import { NexuiBreadcrumb, NexuiBreadcrumbItem } from '@nexui/core';

function BreadcrumbDemo() {
  return (
    <NexuiBreadcrumb>
      <NexuiBreadcrumbItem>
        <a href="/">Home</a>
      </NexuiBreadcrumbItem>
      <NexuiBreadcrumbItem>
        <a href="/docs">Docs</a>
      </NexuiBreadcrumbItem>
      <NexuiBreadcrumbItem current>Components</NexuiBreadcrumbItem>
    </NexuiBreadcrumb>
  );
}

const meta = {
  title: 'NexUI/Breadcrumb',
  component: BreadcrumbDemo,
} satisfies Meta<typeof BreadcrumbDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

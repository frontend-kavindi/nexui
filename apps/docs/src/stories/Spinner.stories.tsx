import type { Meta, StoryObj } from '@storybook/react';
import { NexuiSpinner } from '@nexui/core';

const meta = {
  title: 'NexUI/Spinner',
  component: NexuiSpinner,
  args: {
    'aria-label': 'Loading',
    size: 'md' as const,
  },
} satisfies Meta<typeof NexuiSpinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: 'lg' },
};

import type { Meta, StoryObj } from '@storybook/react';
import { NexuiBadge } from '@nexui/core';

const meta = {
  title: 'NexUI/Badge',
  component: NexuiBadge,
  args: {
    children: 'Badge',
    tone: 'neutral' as const,
  },
} satisfies Meta<typeof NexuiBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Primary: Story = {
  args: { tone: 'primary', children: 'New' },
};

export const Success: Story = {
  args: { tone: 'success', children: 'Active' },
};

export const Warning: Story = {
  args: { tone: 'warning', children: 'Pending' },
};

export const Error: Story = {
  args: { tone: 'error', children: 'Failed' },
};

export const Live: Story = {
  args: { live: true, tone: 'primary', children: '3 unread' },
};

import type { Meta, StoryObj } from '@storybook/react';
import { NexuiAvatar } from '@nexui/core';

const meta = {
  title: 'NexUI/Avatar',
  component: NexuiAvatar,
  args: {
    fallback: 'NA',
    size: 'md' as const,
  },
} satisfies Meta<typeof NexuiAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Fallback: Story = {};

export const Small: Story = {
  args: { size: 'sm', fallback: 'S' },
};

export const Large: Story = {
  args: { size: 'lg', fallback: 'LG' },
};

export const WithImage: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/initials/svg?seed=NexUI',
    alt: 'NexUI placeholder avatar',
    fallback: 'NU',
  },
};

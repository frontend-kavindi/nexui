import type { Meta, StoryObj } from '@storybook/react';
import { NexuiButton } from '@nexui/core';

const meta = {
  title: 'NexUI/Button',
  component: NexuiButton,
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof NexuiButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Secondary: Story = {};

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Danger: Story = {
  args: { variant: 'danger' },
};

export const Link: Story = {
  args: { variant: 'link' },
};

export const Loading: Story = {
  args: { loading: true, variant: 'primary', children: 'Saving…' },
};

export const FullWidth: Story = {
  args: { fullWidth: true, variant: 'primary' },
  parameters: { layout: 'padded' },
};

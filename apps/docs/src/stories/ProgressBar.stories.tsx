import type { Meta, StoryObj } from '@storybook/react';
import { NexuiProgressBar } from '@nexui/core';

const meta = {
  title: 'NexUI/ProgressBar',
  component: NexuiProgressBar,
  args: {
    'aria-label': 'Upload progress',
    value: 62,
  },
} satisfies Meta<typeof NexuiProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};

export const Indeterminate: Story = {
  args: { value: undefined },
};

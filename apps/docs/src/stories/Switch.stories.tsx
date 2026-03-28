import type { Meta, StoryObj } from '@storybook/react';
import { NexuiSwitch } from '@nexui/core';

const meta = {
  title: 'NexUI/Switch',
  component: NexuiSwitch,
  args: {
    label: 'Enable notifications',
    defaultChecked: false,
  },
} satisfies Meta<typeof NexuiSwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};

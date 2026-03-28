import type { Meta, StoryObj } from '@storybook/react';
import { NexuiCheckbox } from '@nexui/core';

const meta = {
  title: 'NexUI/Checkbox',
  component: NexuiCheckbox,
  args: {
    label: 'I agree to the terms',
    name: 'terms',
  },
} satisfies Meta<typeof NexuiCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

import type { Meta, StoryObj } from '@storybook/react';
import { NexuiDatePicker } from '@nexui/core';

const meta = {
  title: 'NexUI/DatePicker',
  component: NexuiDatePicker,
  args: {
    label: 'Start date',
  },
} satisfies Meta<typeof NexuiDatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

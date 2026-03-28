import type { Meta, StoryObj } from '@storybook/react';
import { NexuiSelect } from '@nexui/core';

const flatOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Citrus', value: 'citrus' },
];

const groupedOptions = [
  {
    label: 'Fruit',
    options: [
      { label: 'Apple', value: 'a' },
      { label: 'Banana', value: 'b' },
    ],
  },
  {
    label: 'Vegetable',
    options: [{ label: 'Carrot', value: 'c' }],
  },
];

const meta = {
  title: 'NexUI/Select',
  component: NexuiSelect,
  args: {
    options: flatOptions,
    placeholder: 'Select…',
    'aria-label': 'Example select',
  },
} satisfies Meta<typeof NexuiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const MultiSelect: Story = {
  args: {
    multiple: true,
    defaultValue: ['apple'],
  },
};

export const Grouped: Story = {
  args: {
    options: groupedOptions,
  },
};

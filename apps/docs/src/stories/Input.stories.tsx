import type { Meta, StoryObj } from '@storybook/react';
import { NexuiInput } from '@nexui/core';

const meta = {
  title: 'NexUI/Input',
  component: NexuiInput,
  args: {
    label: 'Label',
    placeholder: 'Type here…',
  },
} satisfies Meta<typeof NexuiInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: true,
    errorMessage: 'This field is required.',
    helperText: 'Helper text',
    defaultValue: '',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    showPasswordToggle: true,
    defaultValue: 'hunter2',
  },
};

export const CharacterCount: Story = {
  args: {
    label: 'Bio',
    maxLength: 120,
    defaultValue: 'Hello',
    helperText: 'Keep it short.',
  },
};

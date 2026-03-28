import type { Meta, StoryObj } from '@storybook/react';
import { NexuiFileUpload } from '@nexui/core';

const meta = {
  title: 'NexUI/FileUpload',
  component: NexuiFileUpload,
  args: {
    label: 'Upload spreadsheet',
    hint: 'CSV or XLSX, max 10MB.',
  },
} satisfies Meta<typeof NexuiFileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

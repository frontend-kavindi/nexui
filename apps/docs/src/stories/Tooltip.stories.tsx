import type { Meta, StoryObj } from '@storybook/react';
import { NexuiButton, NexuiTooltip } from '@nexui/core';

function TooltipPlayground(props: { placement: 'top' | 'bottom'; content: string }) {
  return (
    <NexuiTooltip content={props.content} placement={props.placement}>
      <NexuiButton type="button" variant="secondary">
        Hover or focus
      </NexuiButton>
    </NexuiTooltip>
  );
}

const meta = {
  title: 'NexUI/Tooltip',
  component: TooltipPlayground,
  args: {
    content: 'Short contextual help for this control.',
    placement: 'top' as const,
  },
} satisfies Meta<typeof TooltipPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bottom: Story = {
  args: { placement: 'bottom' },
};

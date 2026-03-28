import type { Meta, StoryObj } from '@storybook/react';
import { NexuiSkeleton } from '@nexui/core';

function SkeletonPlayground(props: { variant: 'text' | 'circular' | 'rectangular' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--nexui-spacing-3)',
        width: '100%',
        maxWidth: 'var(--nexui-breakpoint-sm)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--nexui-spacing-3)', alignItems: 'center' }}>
        <NexuiSkeleton variant="circular" />
        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 'var(--nexui-spacing-2)' }}>
          <NexuiSkeleton variant="text" />
          <NexuiSkeleton variant="text" style={{ width: '70%' }} />
        </div>
      </div>
      <NexuiSkeleton variant={props.variant} />
    </div>
  );
}

const meta = {
  title: 'NexUI/Skeleton',
  component: SkeletonPlayground,
  args: {
    variant: 'rectangular' as const,
  },
} satisfies Meta<typeof SkeletonPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TextLine: Story = {
  args: { variant: 'text' },
};

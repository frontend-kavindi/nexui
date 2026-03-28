import type { Meta, StoryObj } from '@storybook/react';
import { NexuiButton, NexuiCard } from '@nexui/core';

function CardPlayground(props: { title?: string; showFooter?: boolean }) {
  return (
    <NexuiCard
      title={props.title}
      footer={
        props.showFooter ? (
          <>
            <NexuiButton type="button" variant="secondary">
              Cancel
            </NexuiButton>
            <NexuiButton type="button" variant="primary">
              Save
            </NexuiButton>
          </>
        ) : undefined
      }
      style={{ width: '100%', maxWidth: 'var(--nexui-breakpoint-sm)' }}
    >
      Card body copy uses typography tokens for readable defaults.
    </NexuiCard>
  );
}

const meta = {
  title: 'NexUI/Card',
  component: CardPlayground,
  args: {
    title: 'Account',
    showFooter: true,
  },
} satisfies Meta<typeof CardPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoFooter: Story = {
  args: { showFooter: false },
};

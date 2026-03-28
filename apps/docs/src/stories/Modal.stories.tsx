import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NexuiButton, NexuiModal } from '@nexui/core';

function ModalPlayground(props: {
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  closeOnBackdropClick?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <NexuiButton variant="primary" onClick={() => { setOpen(true); }}>
        Open modal
      </NexuiButton>
      <NexuiModal
        open={open}
        onOpenChange={setOpen}
        title={props.title}
        size={props.size}
        closeOnBackdropClick={props.closeOnBackdropClick}
      >
        <p style={{ margin: 0 }}>Dialog body uses design tokens only.</p>
        <NexuiButton variant="secondary" onClick={() => { setOpen(false); }}>
          Close
        </NexuiButton>
      </NexuiModal>
    </>
  );
}

const meta = {
  title: 'NexUI/Modal',
  component: ModalPlayground,
  args: {
    title: 'Modal title',
    size: 'md' as const,
    closeOnBackdropClick: true,
  },
} satisfies Meta<typeof ModalPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Fullscreen: Story = {
  args: { size: 'fullscreen' },
};

export const NoBackdropClose: Story = {
  args: { closeOnBackdropClick: false },
};

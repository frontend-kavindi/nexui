import type { Meta, StoryObj } from '@storybook/react';
import {
  NexuiButton,
  NexuiToastProvider,
  useNexuiToast,
  type NexuiToastPosition,
} from '@nexui/core';

function ToastDemo(props: { position: NexuiToastPosition; tone?: 'default' | 'success' | 'error' }) {
  const { push } = useNexuiToast();
  return (
    <NexuiButton
      variant="primary"
      onClick={() =>
        push({
          title: 'Notification',
          description: 'Token-backed motion and progress bar.',
          position: props.position,
          tone: props.tone ?? 'default',
          duration: 'fast',
        })
      }
    >
      Show toast
    </NexuiButton>
  );
}

const meta = {
  title: 'NexUI/Toast',
  component: ToastDemo,
  decorators: [
    (Story) => (
      <NexuiToastProvider>
        <Story />
      </NexuiToastProvider>
    ),
  ],
  args: {
    position: 'bottom-right' as const,
    tone: 'default' as const,
  },
} satisfies Meta<typeof ToastDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BottomRight: Story = {};

export const TopCenter: Story = {
  args: { position: 'top-center' },
};

export const Success: Story = {
  args: { position: 'top-left', tone: 'success' },
};

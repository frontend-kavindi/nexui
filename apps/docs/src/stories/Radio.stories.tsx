import type { Meta, StoryObj } from '@storybook/react';
import { NexuiRadio, NexuiRadioGroup } from '@nexui/core';

function RadioPlayground(props: { defaultValue?: string; disabled?: boolean }) {
  return (
    <NexuiRadioGroup label="Shipping speed" defaultValue={props.defaultValue ?? 'std'} disabled={props.disabled}>
      <NexuiRadio value="eco" label="Economy" />
      <NexuiRadio value="std" label="Standard" />
      <NexuiRadio value="expr" label="Express" />
    </NexuiRadioGroup>
  );
}

const meta = {
  title: 'NexUI/Radio',
  component: RadioPlayground,
  args: {
    defaultValue: 'std',
    disabled: false,
  },
} satisfies Meta<typeof RadioPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

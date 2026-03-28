import type { Meta, StoryObj } from '@storybook/react';
import { NexuiTab, NexuiTabList, NexuiTabPanel, NexuiTabs } from '@nexui/core';

function TabsPlayground() {
  return (
    <NexuiTabs defaultValue="general" style={{ minWidth: 'var(--nexui-breakpoint-xs)' }}>
      <NexuiTabList>
        <NexuiTab value="general">General</NexuiTab>
        <NexuiTab value="security">Security</NexuiTab>
        <NexuiTab value="billing">Billing</NexuiTab>
      </NexuiTabList>
      <NexuiTabPanel value="general">General settings content.</NexuiTabPanel>
      <NexuiTabPanel value="security">Security settings content.</NexuiTabPanel>
      <NexuiTabPanel value="billing">Billing settings content.</NexuiTabPanel>
    </NexuiTabs>
  );
}

const meta = {
  title: 'NexUI/Tabs',
  component: TabsPlayground,
} satisfies Meta<typeof TabsPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react';
import { NexuiSidebar } from '@nexui/core';

function SidebarDemo() {
  return (
    <NexuiSidebar aria-label="App navigation">
      <nav aria-label="Sections">
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--nexui-spacing-2)' }}>
          <li>
            <a href="#dashboard">Dashboard</a>
          </li>
          <li>
            <a href="#settings">Settings</a>
          </li>
        </ul>
      </nav>
    </NexuiSidebar>
  );
}

const meta = {
  title: 'NexUI/Sidebar',
  component: SidebarDemo,
} satisfies Meta<typeof SidebarDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

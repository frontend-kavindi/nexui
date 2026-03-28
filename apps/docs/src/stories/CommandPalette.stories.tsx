import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { NexuiButton, NexuiCommandPalette } from '@nexui/core';

function CommandPaletteDemo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <NexuiButton type="button" variant="secondary" onClick={() => { setOpen(true); }}>
        Open palette
      </NexuiButton>
      <NexuiCommandPalette
        open={open}
        onOpenChange={setOpen}
        items={[
          { id: 'a', label: 'Go to Dashboard', onSelect: () => {} },
          { id: 'b', label: 'Search settings', onSelect: () => {} },
        ]}
      />
    </>
  );
}

const meta = {
  title: 'NexUI/CommandPalette',
  component: CommandPaletteDemo,
} satisfies Meta<typeof CommandPaletteDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

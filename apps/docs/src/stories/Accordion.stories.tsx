import type { Meta, StoryObj } from '@storybook/react';
import { NexuiAccordion, NexuiAccordionItem } from '@nexui/core';

function AccordionPlayground() {
  return (
    <NexuiAccordion style={{ width: '100%', maxWidth: 'var(--nexui-breakpoint-sm)' }}>
      <NexuiAccordionItem title="What is NexUI?">
        NexUI is a token-driven component set built for accessible product UI.
      </NexuiAccordionItem>
      <NexuiAccordionItem title="How do themes work?" defaultOpen>
        Themes compile design tokens to CSS variables consumed by components.
      </NexuiAccordionItem>
      <NexuiAccordionItem title="Keyboard support">
        Disclosure buttons toggle with Space or Enter like native controls.
      </NexuiAccordionItem>
    </NexuiAccordion>
  );
}

const meta = {
  title: 'NexUI/Accordion',
  component: AccordionPlayground,
} satisfies Meta<typeof AccordionPlayground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

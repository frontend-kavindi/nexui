import type { Meta, StoryObj } from '@storybook/react';
import { useLayoutEffect, useRef } from 'react';
import { registerNexCheckbox } from '@nexui/web-components';

registerNexCheckbox();

function NexCheckboxHost() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.replaceChildren();
    const el = document.createElement('nex-checkbox');
    el.append(document.createTextNode('I agree to the terms'));
    host.append(el);
  }, []);
  return <div ref={ref} />;
}

const meta = {
  title: 'Web Components/nex-checkbox',
  component: NexCheckboxHost,
} satisfies Meta<typeof NexCheckboxHost>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

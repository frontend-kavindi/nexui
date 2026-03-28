import type { Meta, StoryObj } from '@storybook/react';
import { useLayoutEffect, useRef } from 'react';
import { registerNexInput } from '@nexui/web-components';

registerNexInput();

function NexInputHost() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.replaceChildren();
    const el = document.createElement('nex-input');
    el.setAttribute('label', 'Email');
    el.setAttribute('placeholder', 'you@example.com');
    el.setAttribute('helper-text', 'We never share your email.');
    host.append(el);
  }, []);
  return <div ref={ref} style={{ minWidth: 300 }} />;
}

const meta = {
  title: 'Web Components/nex-input',
  component: NexInputHost,
} satisfies Meta<typeof NexInputHost>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

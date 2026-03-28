import type { Meta, StoryObj } from '@storybook/react';
import { useLayoutEffect, useRef } from 'react';
import { registerNexAvatar } from '@nexui/web-components';

registerNexAvatar();

function NexAvatarHost() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.replaceChildren();
    const el = document.createElement('nex-avatar');
    el.setAttribute('size', 'lg');
    const fb = document.createElement('span');
    fb.slot = 'fallback';
    fb.textContent = 'NK';
    el.append(fb);
    host.append(el);
  }, []);
  return <div ref={ref} />;
}

const meta = {
  title: 'Web Components/nex-avatar',
  component: NexAvatarHost,
} satisfies Meta<typeof NexAvatarHost>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Fallback: Story = {};

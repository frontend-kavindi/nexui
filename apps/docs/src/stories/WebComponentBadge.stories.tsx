import type { Meta, StoryObj } from '@storybook/react';
import { useLayoutEffect, useRef } from 'react';
import { registerNexBadge } from '@nexui/web-components';

registerNexBadge();

function NexBadgeHost({ tone, live }: { tone: string; live: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.replaceChildren();
    const el = document.createElement('nex-badge');
    el.setAttribute('tone', tone);
    if (live) el.setAttribute('live', '');
    el.append(document.createTextNode('New'));
    host.append(el);
  }, [tone, live]);
  return <div ref={ref} />;
}

const meta = {
  title: 'Web Components/nex-badge',
  component: NexBadgeHost,
  args: { tone: 'primary', live: false },
  render: (args) => (
    <NexBadgeHost tone={args.tone} live={args.live} />
  ),
} satisfies Meta<typeof NexBadgeHost>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { tone: 'primary' } };

export const LiveStatus: Story = { args: { tone: 'neutral', live: true } };

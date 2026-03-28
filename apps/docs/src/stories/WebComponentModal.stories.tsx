import type { Meta, StoryObj } from '@storybook/react';
import { useLayoutEffect, useRef } from 'react';
import { registerNexModal } from '@nexui/web-components';

registerNexModal();

function NexModalHost() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    host.replaceChildren();
    const wrap = document.createElement('div');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Open modal';
    btn.style.marginRight = '8px';
    const modal = document.createElement('nex-modal');
    modal.setAttribute('size', 'md');
    const title = document.createElement('span');
    title.slot = 'title';
    title.textContent = 'Example';
    const body = document.createElement('p');
    body.textContent = 'Dialog content uses native showModal() when supported.';
    modal.append(title, body);
    btn.addEventListener('click', () => {
      modal.setAttribute('open', '');
    });
    modal.addEventListener('nex-close', () => {
      modal.removeAttribute('open');
    });
    wrap.append(btn, modal);
    host.append(wrap);
  }, []);
  return <div ref={ref} />;
}

const meta = {
  title: 'Web Components/nex-modal',
  component: NexModalHost,
} satisfies Meta<typeof NexModalHost>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

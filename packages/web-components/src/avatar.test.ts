import { afterEach, describe, expect, it } from 'vitest';
import { registerNexAvatar } from './nex-avatar';

registerNexAvatar();

afterEach(() => {
  document.body.replaceChildren();
});

describe('NexAvatar', () => {
  it('shows fallback when src missing', async () => {
    const el = document.createElement('nex-avatar');
    const fb = document.createElement('span');
    fb.slot = 'fallback';
    fb.textContent = 'AB';
    el.append(fb);
    document.body.append(el);
    await el.updateComplete;
    const root = el.shadowRoot?.querySelector('[part="root"]');
    expect(root?.getAttribute('role')).toBe('img');
    expect(root?.getAttribute('aria-label')).toBe('AB');
  });
});

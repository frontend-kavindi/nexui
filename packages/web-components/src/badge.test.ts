import { afterEach, describe, expect, it } from 'vitest';
import { registerNexBadge } from './nex-badge';

registerNexBadge();

afterEach(() => {
  document.body.replaceChildren();
});

describe('NexBadge', () => {
  it('applies tone data attribute and default slot', async () => {
    const el = document.createElement('nex-badge');
    el.setAttribute('tone', 'primary');
    el.append(document.createTextNode('3'));
    document.body.append(el);
    await el.updateComplete;
    const span = el.shadowRoot?.querySelector('span[data-tone="primary"]');
    expect(span).toBeTruthy();
    expect(el.textContent).toContain('3');
  });

  it('sets live region attributes when live', async () => {
    const el = document.createElement('nex-badge');
    el.setAttribute('live', '');
    document.body.append(el);
    await el.updateComplete;
    const span = el.shadowRoot?.querySelector('span[role="status"][aria-live="polite"]');
    expect(span).toBeTruthy();
  });
});

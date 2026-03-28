import { afterEach, describe, expect, it } from 'vitest';
import { NexuiButton, registerNexuiButton } from './nexui-button';

registerNexuiButton();

afterEach(() => {
  document.body.replaceChildren();
});

describe('NexuiButton', () => {
  it('renders slotted text in the shadow tree', async () => {
    const el = document.createElement('nexui-button');
    el.append(document.createTextNode('Hello'));
    document.body.append(el);
    const nexu = el as NexuiButton;
    await nexu.updateComplete;
    expect(nexu.textContent).toContain('Hello');
    expect(nexu.shadowRoot?.querySelector('button')).toBeTruthy();
  });
});

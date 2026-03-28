import { afterEach, describe, expect, it } from 'vitest';
import { registerNexModal } from './nex-modal';

registerNexModal();

afterEach(() => {
  document.body.replaceChildren();
});

describe('NexModal', () => {
  it('renders dialog element in shadow root', async () => {
    const el = document.createElement('nex-modal');
    document.body.append(el);
    await el.updateComplete;
    const dialog = el.shadowRoot?.querySelector('dialog');
    expect(dialog).toBeTruthy();
  });

  it('opens with showModal when open attribute set', async () => {
    const el = document.createElement('nex-modal');
    el.setAttribute('open', '');
    document.body.append(el);
    await el.updateComplete;
    await Promise.resolve();
    const dialog = el.shadowRoot?.querySelector('dialog');
    expect(dialog).toBeInstanceOf(HTMLDialogElement);
    expect(el.open).toBe(true);
    if (dialog instanceof HTMLDialogElement && typeof dialog.showModal === 'function') {
      expect(dialog.open).toBe(true);
    }
  });
});

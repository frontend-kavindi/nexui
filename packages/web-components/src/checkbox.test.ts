import { afterEach, describe, expect, it } from 'vitest';
import { registerNexCheckbox } from './nex-checkbox';

registerNexCheckbox();

afterEach(() => {
  document.body.replaceChildren();
});

describe('NexCheckbox', () => {
  it('toggles checked and dispatches nex-change', async () => {
    const el = document.createElement('nex-checkbox');
    el.append(document.createTextNode('Accept'));
    document.body.append(el);
    await el.updateComplete;
    let checked: boolean | undefined;
    el.addEventListener('nex-change', (e) => {
      if (e instanceof CustomEvent) {
        const detail = e.detail as { checked: boolean };
        if (typeof detail.checked === 'boolean') {
          checked = detail.checked;
        }
      }
    });
    const inp = el.shadowRoot?.querySelector('input[type="checkbox"]');
    expect(inp).toBeInstanceOf(HTMLInputElement);
    if (!(inp instanceof HTMLInputElement)) return;
    inp.click();
    await el.updateComplete;
    expect(checked).toBe(true);
    expect(el.checked).toBe(true);
  });
});

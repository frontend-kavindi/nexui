import { afterEach, describe, expect, it } from 'vitest';
import { registerNexInput } from './nex-input';

registerNexInput();

afterEach(() => {
  document.body.replaceChildren();
});

describe('NexInput', () => {
  it('renders a shadow input with label', async () => {
    const el = document.createElement('nex-input');
    el.setAttribute('label', 'Email');
    document.body.append(el);
    await el.updateComplete;
    const inp = el.shadowRoot?.querySelector('input');
    const lab = el.shadowRoot?.querySelector('label');
    expect(inp).toBeTruthy();
    expect(lab?.textContent).toContain('Email');
  });

  it('dispatches nex-input with typed detail on keystroke', async () => {
    const el = document.createElement('nex-input');
    document.body.append(el);
    await el.updateComplete;
    const heard: string[] = [];
    el.addEventListener('nex-input', (e) => {
      if (e instanceof CustomEvent) {
        const detail = e.detail as { value: string };
        if (typeof detail.value === 'string') {
          heard.push(detail.value);
        }
      }
    });
    const inp = el.shadowRoot?.querySelector('input');
    expect(inp).toBeInstanceOf(HTMLInputElement);
    if (!(inp instanceof HTMLInputElement)) return;
    inp.value = 'a';
    inp.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(heard).toContain('a');
    expect(el.value).toBe('a');
  });
});

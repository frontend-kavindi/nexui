import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiToastProvider from './NexuiToastProvider.vue';
import { useNexuiToast } from './useNexuiToast';

describe('NexuiToastProvider', () => {
  it('injects toast API into descendants', async () => {
    const Inner = defineComponent({
      name: 'ToastConsumer',
      setup() {
        const { push, toasts } = useNexuiToast();
        push({ title: 'Hello' });
        return () => h('div', { id: 'inner', 'data-len': String(toasts.value.length) });
      },
    });

    mount(NexuiToastProvider, {
      slots: {
        default: () => h(Inner),
      },
      attachTo: document.body,
    });

    await nextTick();
    const inner = document.getElementById('inner');
    expect(inner?.getAttribute('data-len')).toBe('1');
    expect(document.querySelector('[aria-live="polite"]')).toBeTruthy();
  });
});

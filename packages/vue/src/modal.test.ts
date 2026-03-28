import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiModal from './NexuiModal.vue';

describe('NexuiModal', () => {
  it('teleports dialog with ARIA attributes when open', async () => {
    const wrapper = mount(NexuiModal, {
      props: { open: true },
      slots: { title: 'T', default: 'Body' },
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    wrapper.unmount();
  });
});

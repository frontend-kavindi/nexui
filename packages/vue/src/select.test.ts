import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiSelect from './NexuiSelect.vue';

const opts = [{ value: 'a', label: 'Alpha' }] as const;

describe('NexuiSelect', () => {
  it('renders trigger with placeholder when empty', () => {
    const wrapper = mount(NexuiSelect, {
      props: { options: [...opts], modelValue: '', placeholder: 'Pick' },
    });
    expect(wrapper.get('button').text()).toContain('Pick');
  });

  it('emits update:modelValue when committing option', async () => {
    const wrapper = mount(NexuiSelect, {
      props: { options: [...opts], modelValue: '' },
      attachTo: document.body,
    });
    await wrapper.get('button').trigger('click');
    const opt = document.querySelector('[role="option"]');
    expect(opt).toBeTruthy();
    (opt as HTMLElement).click();
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['a']);
    wrapper.unmount();
  });
});

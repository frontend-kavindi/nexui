import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiSwitch from './NexuiSwitch.vue';

describe('NexuiSwitch', () => {
  it('exposes switch role and toggles model', async () => {
    const wrapper = mount(NexuiSwitch, { props: { label: 'On', modelValue: false } });
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('false');
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true]);
  });
});

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiInput from './NexuiInput.vue';

describe('NexuiInput', () => {
  it('binds v-model to native input', async () => {
    const wrapper = mount(NexuiInput, { props: { modelValue: 'a' } });
    const input = wrapper.get('input').element as HTMLInputElement;
    expect(input.value).toBe('a');
    await wrapper.get('input').setValue('b');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['b']);
  });

  it('associates label with id', () => {
    const wrapper = mount(NexuiInput, { props: { label: 'Name', modelValue: '' } });
    const id = wrapper.get('input').attributes('id');
    expect(wrapper.get('label').attributes('for')).toBe(id);
  });
});

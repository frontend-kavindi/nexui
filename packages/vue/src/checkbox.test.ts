import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiCheckbox from './NexuiCheckbox.vue';

describe('NexuiCheckbox', () => {
  it('toggles v-model', async () => {
    const wrapper = mount(NexuiCheckbox, { props: { label: 'OK', modelValue: false } });
    await wrapper.get('input').setValue(true);
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true]);
  });
});

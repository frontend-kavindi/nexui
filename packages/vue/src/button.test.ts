import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiButton from './NexuiButton.vue';

describe('NexuiButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(NexuiButton, {
      slots: { default: 'Hello' },
    });
    expect(wrapper.get('button').text()).toContain('Hello');
  });
});

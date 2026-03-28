import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiBadge from './NexuiBadge.vue';

describe('NexuiBadge', () => {
  it('sets status live region when live=true', () => {
    const wrapper = mount(NexuiBadge, { props: { live: true }, slots: { default: '3' } });
    expect(wrapper.get('span').attributes('role')).toBe('status');
  });
});

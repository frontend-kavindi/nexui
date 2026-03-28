import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiAvatar from './NexuiAvatar.vue';

describe('NexuiAvatar', () => {
  it('uses img role on fallback without src', () => {
    const wrapper = mount(NexuiAvatar, { props: { fallback: 'AB', ariaLabel: 'User AB' } });
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('User AB');
  });
});

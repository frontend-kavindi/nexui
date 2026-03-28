import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiButton from './NexuiButton.vue';

describe('NexuiButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(NexuiButton, { slots: { default: 'Hello' } });
    expect(wrapper.get('button').text()).toContain('Hello');
  });

  it('sets aria-busy when loading', () => {
    const wrapper = mount(NexuiButton, { props: { loading: true }, slots: { default: 'Wait' } });
    expect(wrapper.get('button').attributes('aria-busy')).toBe('true');
  });

  it('exposes focus helper', () => {
    const wrapper = mount(NexuiButton, { slots: { default: 'x' }, attachTo: document.body });
    const inst = wrapper.vm as { focus: (o?: FocusOptions) => void };
    inst.focus();
    expect(document.activeElement).toBe(wrapper.get('button').element);
    wrapper.unmount();
  });
});

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StatusBadge from '../components/StatusBadge.vue';

describe('StatusBadge', () => {
  it('renders status label correctly', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'APPROVED'
      }
    });
    expect(wrapper.text()).toBe('APPROVED');
    expect(wrapper.classes()).toContain('badge-approved');
  });

  it('formats multi-word status like NEEDS_CHANGES', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        status: 'NEEDS_CHANGES'
      }
    });
    expect(wrapper.text()).toBe('NEEDS CHANGES');
    expect(wrapper.classes()).toContain('badge-needs_changes');
  });
});

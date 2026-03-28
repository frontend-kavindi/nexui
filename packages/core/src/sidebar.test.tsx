import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiSidebar } from './sidebar';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiSidebar', () => {
  afterEach(() => {
    cleanup();
  });

  it('exposes complementary landmark', () => {
    render(<NexuiSidebar aria-label="App">Nav</NexuiSidebar>);
    expect(screen.getByRole('complementary', { name: 'App' })).toHaveTextContent('Nav');
  });

  it('forwards ref', () => {
    const r = createRef<HTMLElement>();
    render(
      <NexuiSidebar ref={r} aria-label="x">
        a
      </NexuiSidebar>,
    );
    expect(r.current).toBeInstanceOf(HTMLElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiSidebar aria-label="Side">Links</NexuiSidebar>);
    await expectNoA11yViolations(container);
  });
});

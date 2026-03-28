import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiTab, NexuiTabList, NexuiTabPanel, NexuiTabs } from './tabs';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiTabs', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows the active panel only', () => {
    render(
      <NexuiTabs defaultValue="b">
        <NexuiTabList>
          <NexuiTab value="a">A</NexuiTab>
          <NexuiTab value="b">B</NexuiTab>
        </NexuiTabList>
        <NexuiTabPanel value="a">Panel A</NexuiTabPanel>
        <NexuiTabPanel value="b">Panel B</NexuiTabPanel>
      </NexuiTabs>,
    );
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'B' })).toBeVisible();
    expect(screen.getByText('Panel A').closest('[role="tabpanel"]')).toHaveAttribute('hidden', '');
  });

  it('moves focus between tabs with ArrowRight', () => {
    render(
      <NexuiTabs defaultValue="a">
        <NexuiTabList>
          <NexuiTab value="a">Alpha</NexuiTab>
          <NexuiTab value="b">Beta</NexuiTab>
        </NexuiTabList>
        <NexuiTabPanel value="a">A</NexuiTabPanel>
        <NexuiTabPanel value="b">B</NexuiTabPanel>
      </NexuiTabs>,
    );
    const alpha = screen.getByRole('tab', { name: 'Alpha' });
    const beta = screen.getByRole('tab', { name: 'Beta' });
    alpha.focus();
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });
    expect(document.activeElement).toBe(beta);
  });

  it('forwards ref on tabs root', () => {
    const r = createRef<HTMLDivElement>();
    render(
      <NexuiTabs ref={r} defaultValue="a">
        <NexuiTabList>
          <NexuiTab value="a">A</NexuiTab>
        </NexuiTabList>
        <NexuiTabPanel value="a">Content</NexuiTabPanel>
      </NexuiTabs>,
    );
    expect(r.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(
      <NexuiTabs defaultValue="a">
        <NexuiTabList>
          <NexuiTab value="a">One</NexuiTab>
          <NexuiTab value="b">Two</NexuiTab>
        </NexuiTabList>
        <NexuiTabPanel value="a">First</NexuiTabPanel>
        <NexuiTabPanel value="b">Second</NexuiTabPanel>
      </NexuiTabs>,
    );
    await expectNoA11yViolations(container);
  });
});

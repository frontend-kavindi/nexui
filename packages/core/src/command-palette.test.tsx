import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NexuiCommandPalette } from './command-palette';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiCommandPalette', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders dialog when open', () => {
    const fn = vi.fn();
    render(
      <NexuiCommandPalette
        open
        onOpenChange={fn}
        items={[
          { id: '1', label: 'Alpha', onSelect: () => {} },
          { id: '2', label: 'Beta', onSelect: () => {} },
        ]}
      />,
    );
    expect(screen.getByRole('dialog', { name: 'Commands' })).toBeInTheDocument();
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(
      <NexuiCommandPalette
        open
        onOpenChange={() => {}}
        items={[{ id: 'x', label: 'Run', onSelect: () => {} }]}
      />,
    );
    await expectNoA11yViolations(container);
  });
});

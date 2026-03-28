import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NexuiButton } from './button';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiButton', () => {
  it('renders children', () => {
    render(<NexuiButton>Hello</NexuiButton>);
    expect(screen.getByRole('button', { name: 'Hello' })).toBeInTheDocument();
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(
      <NexuiButton variant="primary">Save</NexuiButton>,
    );
    await expectNoA11yViolations(container);
  });
});

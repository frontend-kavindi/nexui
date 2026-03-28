import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiSpinner } from './spinner';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiSpinner', () => {
  afterEach(() => {
    cleanup();
  });

  it('exposes status role', () => {
    render(<NexuiSpinner aria-label="Saving" />);
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const r = createRef<HTMLDivElement>();
    render(<NexuiSpinner ref={r} />);
    expect(r.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiSpinner aria-label="Loading" />);
    await expectNoA11yViolations(container);
  });
});

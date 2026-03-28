import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiProgressBar } from './progress-bar';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiProgressBar', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows determinate value', () => {
    render(<NexuiProgressBar aria-label="Upload" value={42} />);
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute('aria-valuenow', '42');
  });

  it('forwards ref', () => {
    const r = createRef<HTMLDivElement>();
    render(<NexuiProgressBar ref={r} aria-label="x" value={0} />);
    expect(r.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiProgressBar aria-label="Progress" value={50} />);
    await expectNoA11yViolations(container);
  });
});

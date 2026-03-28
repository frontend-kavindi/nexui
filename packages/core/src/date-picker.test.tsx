import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiDatePicker } from './date-picker';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiDatePicker', () => {
  afterEach(() => {
    cleanup();
  });

  it('associates label', () => {
    render(<NexuiDatePicker label="Start date" />);
    expect(screen.getByLabelText('Start date')).toHaveAttribute('type', 'date');
  });

  it('forwards ref', () => {
    const r = createRef<HTMLInputElement>();
    render(<NexuiDatePicker ref={r} label="x" />);
    expect(r.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiDatePicker label="Due" />);
    await expectNoA11yViolations(container);
  });
});

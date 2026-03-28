import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiCheckbox } from './checkbox';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiCheckbox', () => {
  afterEach(() => {
    cleanup();
  });

  it('associates label with the checkbox', () => {
    render(<NexuiCheckbox label="Accept terms" defaultChecked />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeChecked();
  });

  it('forwards ref to the input', () => {
    const r = createRef<HTMLInputElement>();
    render(<NexuiCheckbox ref={r} label="x" />);
    expect(r.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiCheckbox label="Subscribe" name="sub" />);
    await expectNoA11yViolations(container);
  });
});

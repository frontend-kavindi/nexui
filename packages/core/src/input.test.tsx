import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NexuiInput } from './input';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiInput', () => {
  it('associates label with control', () => {
    render(<NexuiInput label="Email" id="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('passes axe in error state with helper and counter', async () => {
    const { container } = render(
      <NexuiInput
        label="Field"
        error
        errorMessage="Required"
        helperText="Hint text"
        maxLength={10}
        defaultValue="hi"
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('passes axe with password toggle', async () => {
    const { container } = render(
      <NexuiInput
        label="Password"
        type="password"
        showPasswordToggle
        defaultValue="secret"
      />,
    );
    await expectNoA11yViolations(container);
  });
});

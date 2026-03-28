import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiSelect } from './select';
import { expectNoA11yViolations } from './test-axe';

const options = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' },
];

describe('NexuiSelect', () => {
  afterEach(() => {
    cleanup();
  });

  it('opens with ArrowDown and exposes listbox options', () => {
    render(<NexuiSelect options={options} aria-label="Choose" />);
    const trigger = screen.getByRole('button', { name: /choose/i });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /one/i })).toBeInTheDocument();
  });

  it('passes axe when closed', async () => {
    const { container } = render(
      <NexuiSelect options={options} aria-label="Pick a value" />,
    );
    await expectNoA11yViolations(container);
  });

  it('passes axe when open', async () => {
    const { container } = render(<NexuiSelect options={options} aria-label="Pick a value" />);
    fireEvent.keyDown(within(container).getByRole('button', { name: /pick a value/i }), { key: 'ArrowDown' });
    await expectNoA11yViolations(document.body);
  });
});

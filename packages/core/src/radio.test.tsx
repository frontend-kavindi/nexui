import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiRadio, NexuiRadioGroup } from './radio';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiRadioGroup / NexuiRadio', () => {
  afterEach(() => {
    cleanup();
  });

  it('selects one option in the group', () => {
    render(
      <NexuiRadioGroup label="Pick" defaultValue="a">
        <NexuiRadio value="a" label="Alpha" />
        <NexuiRadio value="b" label="Beta" />
      </NexuiRadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Alpha' })).toBeChecked();
    fireEvent.click(screen.getByRole('radio', { name: 'Beta' }));
    expect(screen.getByRole('radio', { name: 'Beta' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Alpha' })).not.toBeChecked();
  });

  it('forwards ref on radio input', () => {
    const r = createRef<HTMLInputElement>();
    render(
      <NexuiRadioGroup defaultValue="">
        <NexuiRadio ref={r} value="x" label="X" />
      </NexuiRadioGroup>,
    );
    expect(r.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(
      <NexuiRadioGroup label="Speed" defaultValue="1">
        <NexuiRadio value="1" label="One" />
        <NexuiRadio value="2" label="Two" />
      </NexuiRadioGroup>,
    );
    await expectNoA11yViolations(container);
  });
});

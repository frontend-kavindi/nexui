import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiButton } from './button';
import { NexuiTooltip } from './tooltip';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiTooltip', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows tooltip on hover', async () => {
    render(
      <NexuiTooltip content="Help copy" placement="bottom">
        <NexuiButton type="button">Hover me</NexuiButton>
      </NexuiTooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Hover me' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Help copy');
  });

  it('forwards ref to the tooltip element', async () => {
    const r = createRef<HTMLDivElement>();
    render(
      <NexuiTooltip ref={r} content="Tip">
        <NexuiButton type="button">Target</NexuiButton>
      </NexuiTooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Target' }));
    expect(await screen.findByRole('tooltip')).toBe(r.current);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(
      <NexuiTooltip content="Info">
        <NexuiButton type="button">Label</NexuiButton>
      </NexuiTooltip>,
    );
    await expectNoA11yViolations(container);
  });
});

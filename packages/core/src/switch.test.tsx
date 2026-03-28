import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiSwitch } from './switch';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiSwitch', () => {
  afterEach(() => {
    cleanup();
  });

  it('toggles with click', () => {
    render(<NexuiSwitch label="Notifications" defaultChecked={false} />);
    const sw = screen.getByRole('switch', { name: 'Notifications' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles with Space', () => {
    render(<NexuiSwitch label="Alerts" defaultChecked />);
    const sw = screen.getByRole('switch', { name: 'Alerts' });
    sw.focus();
    fireEvent.keyDown(sw, { key: ' ' });
    expect(sw).toHaveAttribute('aria-checked', 'false');
  });

  it('forwards ref to the button', () => {
    const r = createRef<HTMLButtonElement>();
    render(<NexuiSwitch ref={r} label="x" />);
    expect(r.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiSwitch label="Wi‑Fi" defaultChecked />);
    await expectNoA11yViolations(container);
  });
});

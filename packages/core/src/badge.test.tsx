import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiBadge } from './badge';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiBadge', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<NexuiBadge>New</NexuiBadge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('exposes status region when live', () => {
    render(
      <NexuiBadge live tone="primary">
        3 unread
      </NexuiBadge>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('3 unread');
  });

  it('forwards ref', () => {
    const r = createRef<HTMLSpanElement>();
    render(<NexuiBadge ref={r}>x</NexuiBadge>);
    expect(r.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiBadge tone="success">OK</NexuiBadge>);
    await expectNoA11yViolations(container);
  });
});

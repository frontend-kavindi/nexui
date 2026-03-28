import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiAvatar } from './avatar';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiAvatar', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows fallback when there is no src', () => {
    render(<NexuiAvatar fallback="AB" />);
    expect(screen.getByRole('img', { name: 'AB' })).toBeInTheDocument();
  });

  it('renders an image with alt then switches to fallback on error', () => {
    render(<NexuiAvatar src="https://example.invalid/bad.png" alt="Ada" fallback="A" />);
    const img = screen.getByRole('img', { name: 'Ada' });
    expect(img.tagName).toBe('IMG');
    fireEvent.error(img);
    expect(screen.getByRole('img', { name: 'A' })).toBeInTheDocument();
  });

  it('forwards ref to the wrapper', () => {
    const r = createRef<HTMLDivElement>();
    render(<NexuiAvatar ref={r} fallback="Z" />);
    expect(r.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiAvatar fallback="JD" size="lg" />);
    await expectNoA11yViolations(container);
  });
});

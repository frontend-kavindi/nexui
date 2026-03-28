import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NexuiPagination } from './pagination';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiPagination', () => {
  afterEach(() => {
    cleanup();
  });

  it('changes page', () => {
    const fn = vi.fn();
    render(<NexuiPagination page={1} pageCount={3} onPageChange={fn} />);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(fn).toHaveBeenCalledWith(2);
  });

  it('forwards ref', () => {
    const r = createRef<HTMLElement>();
    render(<NexuiPagination ref={r} page={1} pageCount={2} onPageChange={() => {}} />);
    expect(r.current).toBeInstanceOf(HTMLElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiPagination page={1} pageCount={3} onPageChange={() => {}} />);
    await expectNoA11yViolations(container);
  });
});

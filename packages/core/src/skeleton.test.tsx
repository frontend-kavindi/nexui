import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiSkeleton } from './skeleton';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiSkeleton', () => {
  afterEach(() => {
    cleanup();
  });

  it('forwards ref', () => {
    const r = createRef<HTMLSpanElement>();
    render(<NexuiSkeleton ref={r} variant="text" />);
    expect(r.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiSkeleton variant="rectangular" />);
    await expectNoA11yViolations(container);
  });
});

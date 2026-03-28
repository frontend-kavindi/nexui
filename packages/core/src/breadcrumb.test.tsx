import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiBreadcrumb, NexuiBreadcrumbItem } from './breadcrumb';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiBreadcrumb', () => {
  afterEach(() => {
    cleanup();
  });

  it('marks current page', () => {
    render(
      <NexuiBreadcrumb>
        <NexuiBreadcrumbItem>
          <a href="/">Home</a>
        </NexuiBreadcrumbItem>
        <NexuiBreadcrumbItem current>Here</NexuiBreadcrumbItem>
      </NexuiBreadcrumb>,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Here')).toHaveAttribute('aria-current', 'page');
  });

  it('forwards ref', () => {
    const r = createRef<HTMLElement>();
    render(
      <NexuiBreadcrumb ref={r}>
        <NexuiBreadcrumbItem current>A</NexuiBreadcrumbItem>
      </NexuiBreadcrumb>,
    );
    expect(r.current).toBeInstanceOf(HTMLElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(
      <NexuiBreadcrumb>
        <NexuiBreadcrumbItem>
          <a href="/">Home</a>
        </NexuiBreadcrumbItem>
        <NexuiBreadcrumbItem current>Page</NexuiBreadcrumbItem>
      </NexuiBreadcrumb>,
    );
    await expectNoA11yViolations(container);
  });
});

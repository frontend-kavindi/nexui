import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiCard } from './card';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title and body', () => {
    render(
      <NexuiCard title="Title" footer={<span>Footer</span>}>
        Body
      </NexuiCard>,
    );
    expect(screen.getByRole('heading', { name: 'Title', level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const r = createRef<HTMLDivElement>();
    render(<NexuiCard ref={r}>X</NexuiCard>);
    expect(r.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiCard title="Card">Content line</NexuiCard>);
    await expectNoA11yViolations(container);
  });
});

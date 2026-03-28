import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiAccordion, NexuiAccordionItem } from './accordion';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiAccordion', () => {
  afterEach(() => {
    cleanup();
  });

  it('toggles panel visibility', () => {
    render(
      <NexuiAccordion>
        <NexuiAccordionItem title="Section">
          <p>Body</p>
        </NexuiAccordionItem>
      </NexuiAccordion>,
    );
    expect(screen.queryByText('Body')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /section/i }));
    expect(screen.getByText('Body')).toBeVisible();
  });

  it('forwards ref on item', () => {
    const r = createRef<HTMLDivElement>();
    render(
      <NexuiAccordion>
        <NexuiAccordionItem ref={r} title="T" defaultOpen>
          <span>Inside</span>
        </NexuiAccordionItem>
      </NexuiAccordion>,
    );
    expect(r.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(
      <NexuiAccordion>
        <NexuiAccordionItem title="FAQ" defaultOpen>
          Answer text
        </NexuiAccordionItem>
      </NexuiAccordion>,
    );
    await expectNoA11yViolations(container);
  });
});

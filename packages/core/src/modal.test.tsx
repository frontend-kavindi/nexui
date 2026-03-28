import { cleanup, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiButton } from './button';
import { NexuiModal } from './modal';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiModal', () => {
  afterEach(() => {
    cleanup();
  });

  it('forwards ref to the dialog element', () => {
    const ref = createRef<HTMLDivElement>();
    const noop = (): void => {};
    render(
      <NexuiModal ref={ref} open title="Title" onOpenChange={noop}>
        <p>Body</p>
      </NexuiModal>,
    );
    expect(ref.current).toBeTruthy();
    expect(ref.current).toHaveAttribute('role', 'dialog');
  });

  it('passes axe when open', async () => {
    const noop = (): void => {};
    render(
      <NexuiModal open title="Dialog" onOpenChange={noop}>
        <NexuiButton type="button">Action</NexuiButton>
      </NexuiModal>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
  });
});

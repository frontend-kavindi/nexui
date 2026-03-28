import { act, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NexuiToastProvider, useNexuiToast } from './toast';
import { expectNoA11yViolations } from './test-axe';

function Pusher() {
  const { push } = useNexuiToast();
  return (
    <button
      type="button"
      onClick={() => push({ title: 'Done', description: 'Item saved' })}
    >
      Push
    </button>
  );
}

describe('NexuiToast', () => {
  it('shows a toast and passes axe', async () => {
    render(
      <NexuiToastProvider>
        <Pusher />
      </NexuiToastProvider>,
    );
    act(() => {
      const button = screen.getByRole('button', { name: 'Push' });
      button.click();
    });
    expect(await screen.findByRole('heading', { name: 'Done' })).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
  });

  it('attaches ref on the display:contents wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <NexuiToastProvider ref={ref}>
        <span>child</span>
      </NexuiToastProvider>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

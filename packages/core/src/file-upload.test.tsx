import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { NexuiFileUpload } from './file-upload';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiFileUpload', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders hidden file input', () => {
    const { container } = render(<NexuiFileUpload label="Attach" />);
    expect(container.querySelector('input[type="file"]')).toHaveAttribute('type', 'file');
  });

  it('forwards ref', () => {
    const r = createRef<HTMLInputElement>();
    render(<NexuiFileUpload ref={r} label="x" />);
    expect(r.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(<NexuiFileUpload label="Upload" hint="PDF only" />);
    await expectNoA11yViolations(container);
  });
});

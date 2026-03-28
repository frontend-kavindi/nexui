import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  NexuiTable,
  NexuiTableBody,
  NexuiTableCell,
  NexuiTableHead,
  NexuiTableHeaderCell,
  NexuiTableRow,
} from './table';
import { expectNoA11yViolations } from './test-axe';

describe('NexuiTable', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders semantic table', () => {
    render(
      <NexuiTable>
        <NexuiTableHead>
          <NexuiTableRow>
            <NexuiTableHeaderCell scope="col">A</NexuiTableHeaderCell>
          </NexuiTableRow>
        </NexuiTableHead>
        <NexuiTableBody>
          <NexuiTableRow>
            <NexuiTableCell>1</NexuiTableCell>
          </NexuiTableRow>
        </NexuiTableBody>
      </NexuiTable>,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'A' })).toBeInTheDocument();
  });

  it('passes axe (WCAG 2.1 AA ruleset)', async () => {
    const { container } = render(
      <NexuiTable>
        <caption>Demo</caption>
        <NexuiTableHead>
          <NexuiTableRow>
            <NexuiTableHeaderCell scope="col">Name</NexuiTableHeaderCell>
          </NexuiTableRow>
        </NexuiTableHead>
        <NexuiTableBody>
          <NexuiTableRow>
            <NexuiTableCell>Ada</NexuiTableCell>
          </NexuiTableRow>
        </NexuiTableBody>
      </NexuiTable>,
    );
    await expectNoA11yViolations(container);
  });
});

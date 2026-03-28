import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NexuiButton } from './button';

describe('NexuiButton', () => {
  it('renders children', () => {
    render(<NexuiButton>Hello</NexuiButton>);
    expect(screen.getByRole('button', { name: 'Hello' })).toBeInTheDocument();
  });
});

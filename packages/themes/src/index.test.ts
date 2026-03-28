import { describe, expect, it } from 'vitest';
import { tokens } from './index';

describe('@nexui/themes tokens', () => {
  it('exposes runtime colors from generated tokens', () => {
    expect(tokens.color.brand.primary).toBe('#2563eb');
  });
});

import { describe, expect, it } from 'vitest';
import { nexuiIconPlaceholder } from './index';

describe('@nexui/icons', () => {
  it('exposes a stable placeholder glyph', () => {
    expect(nexuiIconPlaceholder.name).toBe('placeholder');
  });
});

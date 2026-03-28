import { describe, expect, it } from 'vitest';
import { classNames } from './index';

describe('classNames', () => {
  it('joins non-empty strings with a single space', () => {
    expect(classNames('a', 'b')).toBe('a b');
  });

  it('drops empty, null, false, and undefined', () => {
    expect(classNames('a', '', undefined, null, false, 'b')).toBe('a b');
  });
});

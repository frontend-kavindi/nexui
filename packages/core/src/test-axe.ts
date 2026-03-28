import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe-core with WCAG 2.1 AA ruleset on a DOM subtree.
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  } as axe.RunOptions);
  expect(results.violations).toEqual([]);
}

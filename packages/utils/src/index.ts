/**
 * Joins CSS class names, skipping empty or falsy segments.
 */
export function classNames(...segments: ReadonlyArray<string | undefined | null | false>): string {
  return segments.filter((s): s is string => typeof s === 'string' && s.length > 0).join(' ');
}

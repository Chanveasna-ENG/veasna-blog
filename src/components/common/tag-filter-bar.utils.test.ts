import { describe, expect, it } from 'vitest';
import { isTagActive } from './tag-filter-bar.utils';

describe('tag-filter-bar.utils', () => {
  it('returns true when tag matches activeTag case-insensitively', () => {
    expect(isTagActive('Docker', 'docker', 2)).toBe(true);
    expect(isTagActive('astro', 'ASTRO', 1)).toBe(true);
  });

  it('returns true when activeTag is all and index is 0', () => {
    expect(isTagActive('All', 'all', 0)).toBe(true);
    expect(isTagActive('Everything', 'ALL', 0)).toBe(true);
  });

  it('returns false when activeTag is all and index is greater than 0', () => {
    expect(isTagActive('Docker', 'all', 1)).toBe(false);
    expect(isTagActive('Astro', 'all', 3)).toBe(false);
  });

  it('returns false when tag does not match activeTag', () => {
    expect(isTagActive('Docker', 'kubernetes', 1)).toBe(false);
    expect(isTagActive('Astro', 'react', 2)).toBe(false);
  });
});

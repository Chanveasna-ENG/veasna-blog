import { describe, expect, it } from 'vitest';
import {
  filterTocHeadings,
  resolveActiveHeadingId,
  resolveHeadingIndentClass
} from './blog-toc.utils';

describe('blog-toc.utils', () => {
  it('filters headings retaining only depths 2 and 3', () => {
    const headings = [
      { depth: 1, slug: 'intro', text: 'Intro' },
      { depth: 2, slug: 'architecture', text: 'Architecture' },
      { depth: 3, slug: 'components', text: 'Components' },
      { depth: 4, slug: 'details', text: 'Details' }
    ];

    const filtered = filterTocHeadings(headings);
    expect(filtered).toEqual([
      { depth: 2, slug: 'architecture', text: 'Architecture' },
      { depth: 3, slug: 'components', text: 'Components' }
    ]);
  });

  it('resolves indent classes based on depth', () => {
    expect(resolveHeadingIndentClass(2)).toBe('pl-0 text-sm font-medium');
    expect(resolveHeadingIndentClass(3)).toBe('pl-4 text-xs');
  });

  it('handles empty headings array in filterTocHeadings', () => {
    expect(filterTocHeadings([])).toEqual([]);
  });

  describe('resolveActiveHeadingId', () => {
    it('returns null for empty headings array', () => {
      expect(resolveActiveHeadingId([])).toBeNull();
    });

    it('returns first heading when all headings are below the offset', () => {
      const headings = [
        { id: 'heading-1', top: 300 },
        { id: 'heading-2', top: 500 }
      ];
      expect(resolveActiveHeadingId(headings, 140)).toBe('heading-1');
    });

    it('returns the closest heading that has passed the offset', () => {
      const headings = [
        { id: 'heading-1', top: -50 },
        { id: 'heading-2', top: 120 },
        { id: 'heading-3', top: 350 }
      ];
      expect(resolveActiveHeadingId(headings, 140)).toBe('heading-2');
    });

    it('returns the last heading when all have passed the offset', () => {
      const headings = [
        { id: 'heading-1', top: -300 },
        { id: 'heading-2', top: -100 },
        { id: 'heading-3', top: 50 }
      ];
      expect(resolveActiveHeadingId(headings, 140)).toBe('heading-3');
    });
  });
});

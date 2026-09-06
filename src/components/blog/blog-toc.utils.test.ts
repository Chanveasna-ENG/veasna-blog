import { describe, expect, it } from 'vitest';
import { filterTocHeadings, resolveHeadingIndentClass } from './blog-toc.utils';

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

  it('handles empty headings array', () => {
    expect(filterTocHeadings([])).toEqual([]);
  });
});

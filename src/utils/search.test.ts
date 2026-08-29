import { describe, expect, it } from 'vitest';
import { search } from './search';

describe('search utility', () => {
  it('returns empty array when query is empty or whitespace', async () => {
    const resultEmpty = await search('');
    const resultWhitespace = await search('   ');
    expect(resultEmpty).toEqual([]);
    expect(resultWhitespace).toEqual([]);
  });

  it('handles missing Pagefind instance gracefully without throwing', async () => {
    const result = await search('test query');
    expect(Array.isArray(result)).toBe(true);
  });
});

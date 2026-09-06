import { describe, expect, it } from 'vitest';
import { computeBatchVisibility, matchesFilterItem } from './list-filter';

describe('list-filter utilities', () => {
  describe('matchesFilterItem', () => {
    const haystack =
      'Autonomous CRM Sync High-throughput automation and queue worker n8n docker';
    const tags = ['Automation', 'Docker', 'n8n'];

    it('returns true when query is empty and tag is all', () => {
      expect(matchesFilterItem(haystack, tags, '', 'all')).toBe(true);
      expect(matchesFilterItem(haystack, tags, '   ', 'ALL')).toBe(true);
    });

    it('matches query case-insensitively', () => {
      expect(matchesFilterItem(haystack, tags, 'crm', 'all')).toBe(true);
      expect(matchesFilterItem(haystack, tags, 'AUTONOMOUS', 'all')).toBe(true);
      expect(matchesFilterItem(haystack, tags, 'kubernetes', 'all')).toBe(
        false
      );
    });

    it('matches tag case-insensitively', () => {
      expect(matchesFilterItem(haystack, tags, '', 'docker')).toBe(true);
      expect(matchesFilterItem(haystack, tags, '', 'AUTOMATION')).toBe(true);
      expect(matchesFilterItem(haystack, tags, '', 'TypeScript')).toBe(false);
    });

    it('requires both query and tag to match when both specified', () => {
      expect(matchesFilterItem(haystack, tags, 'queue', 'n8n')).toBe(true);
      expect(matchesFilterItem(haystack, tags, 'queue', 'TypeScript')).toBe(
        false
      );
      expect(matchesFilterItem(haystack, tags, 'kubernetes', 'n8n')).toBe(
        false
      );
    });
  });

  describe('computeBatchVisibility', () => {
    it('returns 0 and false when totalMatches is 0', () => {
      expect(computeBatchVisibility(0, 6)).toEqual({
        visibleCount: 0,
        hasMore: false
      });
    });

    it('returns visibleCount capped at totalMatches when total < limit', () => {
      expect(computeBatchVisibility(4, 6)).toEqual({
        visibleCount: 4,
        hasMore: false
      });
    });

    it('returns visibleCount equal to limit and hasMore true when total > limit', () => {
      expect(computeBatchVisibility(10, 6)).toEqual({
        visibleCount: 6,
        hasMore: true
      });
    });

    it('returns hasMore false when limit meets total', () => {
      expect(computeBatchVisibility(10, 10)).toEqual({
        visibleCount: 10,
        hasMore: false
      });
    });
  });
});

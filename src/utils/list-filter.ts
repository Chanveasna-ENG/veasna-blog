export function matchesFilterItem(
  searchHaystack: string,
  itemTags: string[],
  query: string,
  selectedTag: string
): boolean {
  const normalizedTag = (selectedTag || 'all').trim().toLowerCase();
  if (normalizedTag !== 'all') {
    const hasMatchingTag = itemTags.some(
      (t) => t.trim().toLowerCase() === normalizedTag
    );
    if (!hasMatchingTag) {
      return false;
    }
  }

  const trimmedQuery = (query || '').trim().toLowerCase();
  if (trimmedQuery.length > 0) {
    const normalizedHaystack = (searchHaystack || '').toLowerCase();
    if (!normalizedHaystack.includes(trimmedQuery)) {
      return false;
    }
  }

  return true;
}

export function computeBatchVisibility(
  totalMatches: number,
  currentLimit: number
): { visibleCount: number; hasMore: boolean } {
  const safeLimit = Math.max(0, currentLimit);
  const visibleCount = Math.min(totalMatches, safeLimit);
  const hasMore = safeLimit < totalMatches;
  return { visibleCount, hasMore };
}

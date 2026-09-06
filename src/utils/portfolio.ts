export function extractUniqueProjectTags(
  projects: Array<{ data?: { tags?: string[] }; tags?: string[] }>
): string[] {
  const tagMap = new Map<string, string>();

  for (const project of projects) {
    const tags = project.data?.tags || project.tags || [];
    for (const rawTag of tags) {
      const trimmed = rawTag.trim();
      if (!trimmed) {
        continue;
      }
      const key = trimmed.toLowerCase();
      if (!tagMap.has(key)) {
        tagMap.set(key, trimmed);
      }
    }
  }

  return Array.from(tagMap.values()).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
}

export function matchesProjectTag(
  projectTags: string[],
  filterTag: string
): boolean {
  if (!filterTag || filterTag.trim().toLowerCase() === 'all') {
    return true;
  }
  const target = filterTag.trim().toLowerCase();
  return projectTags.some((t) => t.trim().toLowerCase() === target);
}

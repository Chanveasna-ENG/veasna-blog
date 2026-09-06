export function isTagActive(
  tag: string,
  activeTag: string,
  index: number
): boolean {
  const normalizedTag = tag.trim().toLowerCase();
  const normalizedActive = activeTag.trim().toLowerCase();
  return (
    normalizedActive === normalizedTag ||
    (normalizedActive === 'all' && index === 0)
  );
}

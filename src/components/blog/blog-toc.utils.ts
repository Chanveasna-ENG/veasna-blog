export interface TocItem {
  slug: string;
  text: string;
  depth: number;
}

export function filterTocHeadings(
  headings: { depth: number; slug: string; text: string }[]
): TocItem[] {
  return headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3);
}

export function resolveHeadingIndentClass(depth: number): string {
  return depth === 3 ? 'pl-4 text-xs' : 'pl-0 text-sm font-medium';
}

export interface TocItem {
  slug: string;
  text: string;
  depth: number;
}

export interface HeadingRect {
  id: string;
  top: number;
}

export function filterTocHeadings(
  headings: { depth: number; slug: string; text: string }[]
): TocItem[] {
  return headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3);
}

export function resolveHeadingIndentClass(depth: number): string {
  return depth === 3 ? 'pl-4 text-xs' : 'pl-0 text-sm font-medium';
}

export function resolveActiveHeadingId(
  headings: HeadingRect[],
  offset = 140
): string | null {
  if (headings.length === 0) {
    return null;
  }

  for (let i = headings.length - 1; i >= 0; i--) {
    if (headings[i].top <= offset) {
      return headings[i].id;
    }
  }

  return headings[0].id;
}

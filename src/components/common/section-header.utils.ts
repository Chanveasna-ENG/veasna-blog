export interface SectionHeaderProps {
  subtitle: string;
  title: string;
  description?: string;
  as?: 'h1' | 'h2' | 'h3';
  divider?: boolean | 'feather' | 'diamond';
}

export function resolveHeadingSpacing(
  hasDescription: boolean,
  showDivider: boolean
): 'sm' | 'md' | 'none' {
  if (hasDescription) {
    return 'sm';
  }
  if (showDivider) {
    return 'md';
  }
  return 'none';
}

export function resolveDividerConfig(
  divider: boolean | 'feather' | 'diamond' | undefined
): { show: boolean; variant: 'feather' | 'diamond' } {
  if (divider === false) {
    return { show: false, variant: 'feather' };
  }
  if (typeof divider === 'string') {
    return { show: true, variant: divider };
  }
  return { show: true, variant: 'feather' };
}

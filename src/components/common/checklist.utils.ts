export type ChecklistBullet = 'check' | 'diamond';
export type ChecklistSpacing = 'sm' | 'md';

export interface ChecklistProps {
  items: string[];
  bullet?: ChecklistBullet;
  borderTop?: boolean;
  spacing?: ChecklistSpacing;
}

export interface ChecklistResolvedConfig {
  containerClass: string;
  bulletSymbol: string;
  bulletClass: string;
  itemClass: string;
}

export function resolveChecklistConfig(
  props: ChecklistProps
): ChecklistResolvedConfig {
  const bullet = props.bullet ?? 'check';
  const borderTop = props.borderTop ?? false;
  const spacing = props.spacing ?? 'sm';

  const containerClass = [
    spacing === 'md' ? 'space-y-2.5' : 'space-y-2',
    borderTop ? 'border-t border-ink/10 pt-4' : ''
  ]
    .filter(Boolean)
    .join(' ');

  const bulletSymbol = bullet === 'diamond' ? '✦' : '✓';
  const bulletClass =
    bullet === 'diamond'
      ? 'text-bronze font-bold flex-shrink-0 mt-0.5'
      : 'text-bronze font-bold flex-shrink-0';

  const itemClass = 'font-body text-xs text-ink flex items-start gap-2';

  return { containerClass, bulletSymbol, bulletClass, itemClass };
}

export interface ParagraphProps {
  variant?: 'lead' | 'body' | 'small' | 'caption';
  color?: 'ink' | 'inkMuted' | 'bronze' | 'parchment';
  align?: 'left' | 'center' | 'right';
  clamp?: 1 | 2 | 3 | 4 | 'none';
}

const variantClasses: Record<NonNullable<ParagraphProps['variant']>, string> = {
  lead: 'text-lg sm:text-xl leading-relaxed',
  body: 'text-base sm:text-lg leading-relaxed',
  small: 'text-sm leading-relaxed',
  caption: 'text-xs italic'
};

const colorClasses: Record<NonNullable<ParagraphProps['color']>, string> = {
  ink: 'text-ink',
  inkMuted: 'text-inkMuted',
  bronze: 'text-bronze',
  parchment: 'text-parchment'
};

const alignClasses: Record<NonNullable<ParagraphProps['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
};

const clampClasses: Record<NonNullable<ParagraphProps['clamp']>, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  none: ''
};

export function getParagraphClasses(props: ParagraphProps = {}): string {
  const { variant = 'body', color, align = 'left', clamp = 'none' } = props;

  const defaultColor = variant === 'lead' ? 'ink' : 'inkMuted';
  const selectedColorKey = color || defaultColor;

  const selectedVariant = variantClasses[variant] || variantClasses.body;
  const selectedColor = colorClasses[selectedColorKey] || colorClasses.inkMuted;
  const selectedAlign = alignClasses[align] || alignClasses.left;
  const selectedClamp = clampClasses[clamp] || '';

  return [
    'font-body',
    selectedVariant,
    selectedColor,
    selectedAlign,
    selectedClamp
  ]
    .filter(Boolean)
    .join(' ');
}

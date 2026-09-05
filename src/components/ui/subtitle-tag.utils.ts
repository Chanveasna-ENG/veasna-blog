export interface SubtitleTagProps {
  variant?: 'bordered' | 'badge' | 'ghost';
  color?: 'bronze' | 'ink' | 'gold';
  size?: 'sm' | 'md';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  as?: 'span' | 'div';
}

const variantClasses: Record<
  NonNullable<SubtitleTagProps['variant']>,
  string
> = {
  bordered: 'border bg-transparent',
  badge: 'border bg-parchmentDark/60',
  ghost: 'border-0 bg-transparent'
};

const colorClasses: Record<NonNullable<SubtitleTagProps['color']>, string> = {
  bronze: 'text-bronze border-bronze',
  ink: 'text-ink border-ink',
  gold: 'text-gold border-gold'
};

const spacingClasses: Record<
  NonNullable<SubtitleTagProps['spacing']>,
  string
> = {
  none: '',
  xs: 'mb-2',
  sm: 'mb-3',
  md: 'mb-4',
  lg: 'mb-6'
};

const baseClasses =
  'inline-block font-heading font-semibold uppercase tracking-widest';

export function getSubtitleTagClasses(props: SubtitleTagProps = {}): string {
  const {
    variant = 'bordered',
    color = 'bronze',
    size = 'sm',
    spacing = 'sm'
  } = props;

  const selectedVariant = variantClasses[variant] || variantClasses.bordered;
  const selectedColor = colorClasses[color] || colorClasses.bronze;
  const selectedSpacing = spacingClasses[spacing] ?? spacingClasses.sm;

  let sizeClass = '';
  if (size === 'md') {
    sizeClass =
      variant === 'ghost'
        ? 'text-xs md:text-sm px-0 py-0'
        : 'text-xs md:text-sm px-4 py-1';
  } else {
    sizeClass =
      variant === 'ghost' ? 'text-xs px-0 py-0' : 'text-xs px-3.5 py-1';
  }

  return [
    baseClasses,
    selectedColor,
    selectedVariant,
    sizeClass,
    selectedSpacing
  ]
    .filter(Boolean)
    .join(' ');
}

export interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  size?: 'display' | 'hero' | 'section' | 'card' | 'sub' | 'sm';
  color?: 'ink' | 'bronze' | 'parchment' | 'gold';
  align?: 'left' | 'center' | 'right';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  clamp?: 1 | 2 | 3 | 'none';
  id?: string;
}

const defaultSizeMap: Record<
  NonNullable<HeadingProps['as']>,
  NonNullable<HeadingProps['size']>
> = {
  h1: 'hero',
  h2: 'section',
  h3: 'card',
  h4: 'sub',
  h5: 'sm',
  h6: 'sm',
  span: 'card',
  div: 'sub'
};

const sizeClasses: Record<NonNullable<HeadingProps['size']>, string> = {
  display:
    'text-6xl sm:text-8xl md:text-9xl font-bold leading-none tracking-tight',
  hero: 'text-3xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-wide',
  section: 'text-3xl sm:text-4xl md:text-5xl font-bold leading-tight',
  card: 'text-xl sm:text-2xl font-bold',
  sub: 'text-lg sm:text-xl font-semibold',
  sm: 'text-base font-semibold'
};

const colorClasses: Record<NonNullable<HeadingProps['color']>, string> = {
  ink: 'text-ink',
  bronze: 'text-bronze',
  parchment: 'text-parchment',
  gold: 'text-gold'
};

const alignClasses: Record<NonNullable<HeadingProps['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
};

const spacingClasses: Record<NonNullable<HeadingProps['spacing']>, string> = {
  none: '',
  xs: 'mb-1',
  sm: 'mb-3',
  md: 'mb-4',
  lg: 'mb-6'
};

const clampClasses: Record<NonNullable<HeadingProps['clamp']>, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  none: ''
};

export function getHeadingClasses(props: HeadingProps = {}): string {
  const {
    as = 'h2',
    size,
    color = 'ink',
    align = 'left',
    spacing = 'md',
    clamp = 'none'
  } = props;

  const resolvedSize = size || defaultSizeMap[as] || 'section';
  const selectedSizeClass = sizeClasses[resolvedSize] || sizeClasses.section;
  const selectedColorClass = colorClasses[color] || colorClasses.ink;
  const selectedAlignClass = alignClasses[align] || alignClasses.left;
  const selectedSpacing =
    spacing in spacingClasses ? spacingClasses[spacing] : spacingClasses.md;
  const selectedClamp = clampClasses[clamp] || '';

  return [
    'font-heading',
    selectedSizeClass,
    selectedColorClass,
    selectedAlignClass,
    selectedSpacing,
    selectedClamp
  ]
    .filter(Boolean)
    .join(' ');
}

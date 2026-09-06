export type SecondaryButtonSize = 'sm' | 'md' | 'lg';

export interface SecondaryButtonOptions {
  size?: SecondaryButtonSize;
  active?: boolean;
  fullWidth?: boolean;
}

export function resolveSecondaryButtonClasses(
  options: SecondaryButtonOptions = {}
): {
  containerClass: string;
  innerLineClass: string;
} {
  const size = options.size ?? 'md';
  const active = Boolean(options.active);
  const isFullWidth = Boolean(options.fullWidth);

  const sizeClasses: Record<SecondaryButtonSize, string> = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-6 py-3 text-xs sm:text-sm',
    lg: 'px-8 py-3.5 text-sm sm:text-base'
  };

  const widthClasses = isFullWidth
    ? 'w-full flex items-center justify-center text-center'
    : 'inline-flex items-center justify-center';

  const stateContainerClasses = active
    ? 'text-parchment bg-ink border-ink shadow-sm'
    : 'text-ink bg-transparent hover:bg-parchmentDark border-ink';

  const stateInnerLineClasses = active
    ? 'border-parchment opacity-60'
    : 'border-ink opacity-30 group-hover:opacity-60';

  const containerClass = [
    'relative font-heading font-semibold uppercase tracking-wider border-2 transition-all duration-200 group cursor-pointer',
    sizeClasses[size],
    widthClasses,
    stateContainerClasses
  ]
    .filter(Boolean)
    .join(' ');

  const innerLineClass = [
    'absolute inset-[2px] border pointer-events-none transition-colors duration-200',
    stateInnerLineClasses
  ].join(' ');

  return {
    containerClass,
    innerLineClass
  };
}

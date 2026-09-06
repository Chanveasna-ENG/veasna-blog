export type PrimaryButtonSize = 'sm' | 'md' | 'lg';

export interface PrimaryButtonOptions {
  size?: PrimaryButtonSize;
  fullWidth?: boolean | 'mobile';
}

export function resolvePrimaryButtonClasses(
  options: PrimaryButtonOptions = {}
): {
  containerClass: string;
  innerLineClass: string;
} {
  const size = options.size ?? 'lg';

  const sizeClasses: Record<PrimaryButtonSize, string> = {
    sm: 'px-4 py-2 text-sm sm:text-base',
    md: 'px-6 py-2.5 text-base md:text-lg',
    lg: 'px-8 py-3.5 text-lg md:text-xl'
  };

  let widthClasses = 'inline-flex items-center justify-center';
  if (options.fullWidth === 'mobile') {
    widthClasses =
      'w-full sm:w-auto flex sm:inline-flex items-center justify-center text-center';
  } else if (options.fullWidth) {
    widthClasses = 'w-full flex items-center justify-center text-center';
  }

  const containerClass = [
    'relative font-heading font-bold uppercase tracking-wider text-parchment bg-crimson hover:bg-bronze border-2 border-bronze hover:border-ink transition-all duration-300 group engraved-shadow cursor-pointer',
    sizeClasses[size],
    widthClasses
  ].join(' ');

  const innerLineClass =
    'absolute inset-[3px] border border-bronze opacity-60 group-hover:border-parchment transition-colors pointer-events-none';

  return {
    containerClass,
    innerLineClass
  };
}

export interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  size?: 'big' | 'normal' | 'small';
  align?: 'center' | 'left';
  as?: 'h1' | 'h2' | 'h3';
  headingSize?: 'hero' | 'section' | 'card';
  subtitleVariant?: 'bordered' | 'badge' | 'ghost';
  subtitleSize?: 'sm' | 'md';
  paragraphVariant?: 'lead' | 'body' | 'small';
  divider?: boolean | 'feather' | 'diamond';
  clampTitle?: 1 | 2 | 3 | 'none';
  clampDescription?: 1 | 2 | 3 | 4 | 'none';
}

export interface ResolvedHeaderConfig {
  align: 'center' | 'left';
  as: 'h1' | 'h2' | 'h3';
  headingSize: 'hero' | 'section' | 'card';
  headingSpacing: 'lg' | 'md' | 'sm' | 'none';
  subtitleSize: 'sm' | 'md';
  subtitleSpacing: 'lg' | 'md' | 'sm' | 'xs' | 'none';
  subtitleVariant: 'bordered' | 'badge' | 'ghost';
  paragraphVariant: 'lead' | 'body' | 'small';
  containerClass: string;
  showDivider: boolean;
  dividerVariant: 'feather' | 'diamond';
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
  divider: boolean | 'feather' | 'diamond' | undefined,
  defaultShow = true
): { show: boolean; variant: 'feather' | 'diamond' } {
  if (divider === false) {
    return { show: false, variant: 'feather' };
  }
  if (divider === true) {
    return { show: true, variant: 'feather' };
  }
  if (typeof divider === 'string') {
    return { show: true, variant: divider };
  }
  return { show: defaultShow, variant: 'feather' };
}

function resolveBigHeaderConfig(
  props: SectionHeaderProps,
  hasDescription: boolean
): ResolvedHeaderConfig {
  const align = props.align ?? 'center';
  const dividerConfig = resolveDividerConfig(props.divider, false);
  const containerClass =
    align === 'center'
      ? 'max-w-4xl mx-auto flex flex-col items-center text-center mb-8'
      : 'max-w-4xl flex flex-col items-start text-left mb-8';

  return {
    align,
    as: props.as ?? 'h1',
    headingSize: props.headingSize ?? 'hero',
    headingSpacing: hasDescription ? 'lg' : 'none',
    subtitleSize: props.subtitleSize ?? 'md',
    subtitleSpacing: 'lg',
    subtitleVariant: props.subtitleVariant ?? 'bordered',
    paragraphVariant: props.paragraphVariant ?? 'lead',
    containerClass,
    showDivider: dividerConfig.show,
    dividerVariant: dividerConfig.variant
  };
}

function resolveSmallHeaderConfig(
  props: SectionHeaderProps
): ResolvedHeaderConfig {
  const align = props.align ?? 'left';
  const dividerConfig = resolveDividerConfig(props.divider, false);
  const containerClass =
    align === 'center'
      ? 'w-full flex flex-col items-center text-center'
      : 'w-full flex flex-col items-start text-left';

  return {
    align,
    as: props.as ?? 'h3',
    headingSize: props.headingSize ?? 'card',
    headingSpacing: 'sm',
    subtitleSize: props.subtitleSize ?? 'sm',
    subtitleSpacing: 'xs',
    subtitleVariant: props.subtitleVariant ?? 'bordered',
    paragraphVariant: props.paragraphVariant ?? 'small',
    containerClass,
    showDivider: dividerConfig.show,
    dividerVariant: dividerConfig.variant
  };
}

function resolveNormalHeaderConfig(
  props: SectionHeaderProps,
  hasDescription: boolean
): ResolvedHeaderConfig {
  const align = props.align ?? 'center';
  const dividerConfig = resolveDividerConfig(props.divider, true);
  const containerClass =
    align === 'center'
      ? 'max-w-5xl mx-auto flex flex-col items-center text-center mt-6 md:mt-8 mb-6 md:mb-8'
      : 'max-w-5xl flex flex-col items-start text-left mt-6 md:mt-8 mb-6 md:mb-8';

  return {
    align,
    as: props.as ?? 'h2',
    headingSize: props.headingSize ?? 'section',
    headingSpacing: resolveHeadingSpacing(hasDescription, dividerConfig.show),
    subtitleSize: props.subtitleSize ?? 'sm',
    subtitleSpacing: 'sm',
    subtitleVariant: props.subtitleVariant ?? 'bordered',
    paragraphVariant: props.paragraphVariant ?? 'lead',
    containerClass,
    showDivider: dividerConfig.show,
    dividerVariant: dividerConfig.variant
  };
}

export function resolveHeaderConfig(
  props: SectionHeaderProps,
  hasDescription: boolean
): ResolvedHeaderConfig {
  const size = props.size ?? 'normal';

  if (size === 'big') {
    return resolveBigHeaderConfig(props, hasDescription);
  }

  if (size === 'small') {
    return resolveSmallHeaderConfig(props);
  }

  return resolveNormalHeaderConfig(props, hasDescription);
}

export interface MedievalFrameProps {
  size?: 'small' | 'medium' | 'big';
  interactive?: boolean;
  background?: 'parchment' | 'transparent';
  as?: 'div' | 'article';
}

export interface ResolvedMedievalFrameConfig {
  cornerSize: number;
  containerClass: string;
  tag: 'div' | 'article';
}

export function resolveCornerSize(
  size: 'small' | 'medium' | 'big' = 'small'
): number {
  if (size === 'big') {
    return 150;
  }
  if (size === 'medium') {
    return 69;
  }
  return 48;
}

export function resolvePaddingClass(
  size: 'small' | 'medium' | 'big' = 'small'
): string {
  if (size === 'big') {
    return 'p-8 sm:p-12 md:p-16';
  }
  if (size === 'medium') {
    return 'p-8 sm:p-10';
  }
  return 'p-6 sm:p-8';
}

export function resolveBackgroundClass(
  background: 'parchment' | 'transparent' = 'parchment'
): string {
  return background === 'transparent' ? 'bg-transparent' : 'bg-parchment/50';
}

export function resolveInteractiveClass(interactive = false): string {
  if (!interactive) {
    return '';
  }
  return 'engraved-shadow group hover:border-bronze hover:shadow-[6px_6px_0px_0px_#4a2e0b] transition-all duration-300';
}

export function resolveMedievalFrameConfig(
  props: MedievalFrameProps = {}
): ResolvedMedievalFrameConfig {
  const size = props.size ?? 'small';
  const cornerSize = resolveCornerSize(size);
  const paddingClass = resolvePaddingClass(size);
  const bgClass = resolveBackgroundClass(props.background);
  const interactiveClass = resolveInteractiveClass(props.interactive);

  const containerClass = [
    'medieval-frame relative w-full flex flex-col justify-between',
    paddingClass,
    bgClass,
    interactiveClass
  ]
    .filter(Boolean)
    .join(' ');

  return {
    cornerSize,
    containerClass,
    tag: props.as ?? 'div'
  };
}

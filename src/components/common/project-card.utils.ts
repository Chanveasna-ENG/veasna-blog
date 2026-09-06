export interface ProjectItemData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  coverImageSrc?: string;
}

export type ProjectCardVariant = 'slider' | 'grid';

export interface ProjectCardProps {
  project: ProjectItemData;
  variant?: ProjectCardVariant;
}

export interface ProjectCardResolvedConfig {
  imageSrc: string;
  href: string;
  label: string;
  isSlider: boolean;
  primaryTag: string;
}

export function resolveProjectCardConfig(
  props: ProjectCardProps
): ProjectCardResolvedConfig {
  const variant = props.variant ?? 'slider';
  const isSlider = variant === 'slider';
  const imageSrc = props.project.coverImageSrc || '/images/profile.jpg';
  const href = `/posts/${props.project.id}`;
  const label = isSlider ? 'Case Study' : 'Comprehensive Case Study';
  const primaryTag = props.project.tags[0] || 'System Architecture';

  return {
    imageSrc,
    href,
    label,
    isSlider,
    primaryTag
  };
}

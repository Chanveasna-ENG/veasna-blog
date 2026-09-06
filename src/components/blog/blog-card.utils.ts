import { formatDateICT } from '../../utils/date';

export interface BlogCardInput {
  id: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  coverImageSrc?: string;
  coverAlt?: string;
  createdAt: Date;
  lastModifiedAt?: Date;
}

export interface BlogCardResolvedConfig {
  href: string;
  imageSrc: string;
  hasCustomImage: boolean;
  dateText: string;
  categoryLabel: string;
  primaryTags: string[];
}

export function resolveBlogCardConfig(
  input: BlogCardInput
): BlogCardResolvedConfig {
  const href = `/posts/${input.id}`;
  const hasCustomImage = Boolean(input.coverImageSrc);
  const imageSrc = input.coverImageSrc || '/images/profile.jpg';
  const targetDate = input.lastModifiedAt || input.createdAt;
  const dateText = formatDateICT(targetDate).split(',')[0];
  const categoryLabel = input.category || 'Article';
  const primaryTags = (input.tags || []).slice(0, 3);

  return {
    href,
    imageSrc,
    hasCustomImage,
    dateText,
    categoryLabel,
    primaryTags
  };
}

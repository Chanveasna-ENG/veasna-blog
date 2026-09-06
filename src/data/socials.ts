export type SocialPlatform =
  | 'linkedin'
  | 'upwork'
  | 'instagram'
  | 'email'
  | 'github'
  | 'telegram'
  | 'whatsapp'
  | 'facebook';

export interface SocialLinkItem {
  platform: SocialPlatform;
  href: string;
  label?: string;
}

export const DEFAULT_SOCIAL_LABELS: Record<SocialPlatform, string> = {
  linkedin: 'LinkedIn',
  upwork: 'Upwork',
  instagram: 'Instagram',
  email: 'Email',
  github: 'GitHub',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook'
};

export const primarySocialLinks: SocialLinkItem[] = [
  { platform: 'linkedin', href: 'https://linkedin.com/in/chanveasna-eng' },
  { platform: 'upwork', href: 'https://upwork.com' },
  { platform: 'telegram', href: 'https://t.me/' },
  { platform: 'email', href: 'mailto:contact@chanveasna.eng' }
];

export const allSocialLinks: SocialLinkItem[] = [
  { platform: 'linkedin', href: 'https://linkedin.com/in/chanveasna-eng' },
  { platform: 'upwork', href: 'https://upwork.com' },
  { platform: 'telegram', href: 'https://t.me/' },
  { platform: 'email', href: 'mailto:contact@chanveasna.eng' },
  { platform: 'github', href: 'https://github.com/chanveasna-eng' },
  { platform: 'facebook', href: 'https://facebook.com' },
  { platform: 'whatsapp', href: 'https://wa.me/' },
  { platform: 'instagram', href: 'https://instagram.com' }
];

export const socialLinks: SocialLinkItem[] = allSocialLinks;

export function getUpworkUrl(): string {
  const upworkLink = primarySocialLinks.find((s) => s.platform === 'upwork');
  return upworkLink?.href || 'https://upwork.com';
}

export function getSocialLabel(
  platform: SocialPlatform,
  customLabel?: string
): string {
  return customLabel || DEFAULT_SOCIAL_LABELS[platform] || platform;
}

export function getSocialIconPath(platform: SocialPlatform): string {
  return `/svg/icon-${platform}.svg`;
}

export function getSocialTarget(platform: SocialPlatform): {
  target: string;
  rel?: string;
} {
  if (platform === 'email') {
    return { target: '_self' };
  }
  return {
    target: '_blank',
    rel: 'noopener noreferrer'
  };
}

export type SocialLinkSize = 'sm' | 'md';

export function getSocialLinkDimensions(size: SocialLinkSize = 'md'): {
  boxClass: string;
  iconClass: string;
  iconDimension: number;
} {
  if (size === 'sm') {
    return {
      boxClass: 'w-9 h-9',
      iconClass: 'w-4 h-4',
      iconDimension: 16
    };
  }
  return {
    boxClass: 'w-11 h-11',
    iconClass: 'w-5 h-5',
    iconDimension: 20
  };
}

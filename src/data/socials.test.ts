import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SOCIAL_LABELS,
  type SocialPlatform,
  allSocialLinks,
  getSocialIconPath,
  getSocialLabel,
  getSocialLinkDimensions,
  getSocialTarget,
  getUpworkUrl,
  primarySocialLinks,
  socialLinks
} from './socials';

describe('social data and utilities', () => {
  const allPlatforms: SocialPlatform[] = [
    'linkedin',
    'upwork',
    'instagram',
    'email',
    'github',
    'telegram',
    'whatsapp',
    'facebook'
  ];

  it('maps each platform to correct human-readable default label', () => {
    expect(DEFAULT_SOCIAL_LABELS.linkedin).toBe('LinkedIn');
    expect(DEFAULT_SOCIAL_LABELS.upwork).toBe('Upwork');
    expect(DEFAULT_SOCIAL_LABELS.instagram).toBe('Instagram');
    expect(DEFAULT_SOCIAL_LABELS.email).toBe('Email');
    expect(DEFAULT_SOCIAL_LABELS.github).toBe('GitHub');
    expect(DEFAULT_SOCIAL_LABELS.telegram).toBe('Telegram');
    expect(DEFAULT_SOCIAL_LABELS.whatsapp).toBe('WhatsApp');
    expect(DEFAULT_SOCIAL_LABELS.facebook).toBe('Facebook');
  });

  it('getSocialLabel returns custom override if provided', () => {
    expect(getSocialLabel('facebook', 'My SME Facebook Group')).toBe(
      'My SME Facebook Group'
    );
    expect(getSocialLabel('telegram')).toBe('Telegram');
  });

  it('getSocialIconPath maps platform to /svg/icon-{platform}.svg', () => {
    for (const platform of allPlatforms) {
      expect(getSocialIconPath(platform)).toBe(`/svg/icon-${platform}.svg`);
    }
  });

  it('getSocialTarget returns _self without rel for email', () => {
    expect(getSocialTarget('email')).toEqual({ target: '_self' });
  });

  it('getSocialTarget returns _blank with rel for external platforms', () => {
    expect(getSocialTarget('facebook')).toEqual({
      target: '_blank',
      rel: 'noopener noreferrer'
    });
    expect(getSocialTarget('telegram')).toEqual({
      target: '_blank',
      rel: 'noopener noreferrer'
    });
  });

  it('primarySocialLinks contains exactly 4 core platforms', () => {
    expect(primarySocialLinks).toHaveLength(4);
    const platforms = primarySocialLinks.map((item) => item.platform);
    expect(platforms).toEqual(['linkedin', 'upwork', 'telegram', 'email']);
  });

  it('allSocialLinks array contains all 8 required platforms', () => {
    expect(allSocialLinks).toHaveLength(8);
    const platformsInArray = allSocialLinks.map((item) => item.platform);
    for (const platform of allPlatforms) {
      expect(platformsInArray).toContain(platform);
    }
  });

  it('socialLinks aliases allSocialLinks', () => {
    expect(socialLinks).toBe(allSocialLinks);
  });

  it('getSocialLinkDimensions returns md dimensions by default', () => {
    const dims = getSocialLinkDimensions();
    expect(dims.boxClass).toBe('w-11 h-11');
    expect(dims.iconClass).toBe('w-5 h-5');
    expect(dims.iconDimension).toBe(20);
  });

  it('getSocialLinkDimensions returns sm dimensions when requested', () => {
    const dims = getSocialLinkDimensions('sm');
    expect(dims.boxClass).toBe('w-9 h-9');
    expect(dims.iconClass).toBe('w-4 h-4');
    expect(dims.iconDimension).toBe(16);
  });

  it('getUpworkUrl returns a valid https Upwork profile URL', () => {
    const url = getUpworkUrl();
    expect(url).toBeDefined();
    expect(url.startsWith('https://')).toBe(true);
    expect(url).toContain('upwork.com');
  });
});

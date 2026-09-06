import { describe, expect, it } from 'vitest';
import { resolveBlogCardConfig } from './blog-card.utils';

describe('resolveBlogCardConfig', () => {
  it('resolves config with custom cover image and slices tags to 3', () => {
    const config = resolveBlogCardConfig({
      id: 'custom-post',
      title: 'Custom Title',
      description: 'Custom Description for blog post.',
      category: 'learning',
      tags: ['Astro', 'TypeScript', 'Tailwind', 'Vite', 'Node'],
      coverImageSrc: '/images/custom-cover.png',
      coverAlt: 'Custom Cover',
      createdAt: new Date('2026-04-20T10:00:00Z')
    });

    expect(config.href).toBe('/posts/custom-post');
    expect(config.hasCustomImage).toBe(true);
    expect(config.imageSrc).toBe('/images/custom-cover.png');
    expect(config.categoryLabel).toBe('learning');
    expect(config.primaryTags).toEqual(['Astro', 'TypeScript', 'Tailwind']);
    expect(config.dateText).toBeTruthy();
  });

  it('resolves fallback image when coverImageSrc is not provided', () => {
    const config = resolveBlogCardConfig({
      id: 'no-image-post',
      title: 'No Image Title',
      description: 'Post description without image.',
      createdAt: new Date('2026-01-15T08:00:00Z')
    });

    expect(config.href).toBe('/posts/no-image-post');
    expect(config.hasCustomImage).toBe(false);
    expect(config.imageSrc).toBe('/images/profile.jpg');
    expect(config.categoryLabel).toBe('Article');
    expect(config.primaryTags).toEqual([]);
    expect(config.readingTimeText).toBe('1 min read');
  });

  it('computes reading time text from provided wordCount or body', () => {
    const config = resolveBlogCardConfig({
      id: 'long-post',
      title: 'Long Post',
      description: 'A long post description.',
      createdAt: new Date('2026-01-15T08:00:00Z'),
      wordCount: 650
    });

    expect(config.readingTimeText).toBe('4 min read');
  });
});

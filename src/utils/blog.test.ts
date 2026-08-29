import { describe, expect, it } from 'vitest';
import { type MinimalBlogPost, getLatestPosts } from './blog';

describe('Blog Utility', () => {
  const samplePosts: MinimalBlogPost[] = [
    {
      id: 'post-old',
      data: {
        title: 'Old Post',
        description: 'Description for old post content.',
        createdAt: new Date('2025-01-01'),
        draft: false,
        category: 'blog'
      }
    },
    {
      id: 'post-draft',
      data: {
        title: 'Draft Post',
        description: 'Description for draft post.',
        createdAt: new Date('2026-03-01'),
        draft: true,
        category: 'learning'
      }
    },
    {
      id: 'post-new',
      data: {
        title: 'New Post',
        description: 'Description for newer post.',
        createdAt: new Date('2026-02-01'),
        draft: false,
        category: 'project'
      }
    },
    {
      id: 'post-updated',
      data: {
        title: 'Updated Post',
        description: 'Description for updated post.',
        createdAt: new Date('2025-06-01'),
        lastModifiedAt: new Date('2026-02-15'),
        draft: false,
        category: 'blog'
      }
    }
  ];

  it('filters out draft posts', () => {
    const result = getLatestPosts(samplePosts);
    expect(result.some((p) => p.data.draft)).toBe(false);
    expect(result.some((p) => p.id === 'post-draft')).toBe(false);
  });

  it('sorts posts descending by most recent date (createdAt or lastModifiedAt)', () => {
    const result = getLatestPosts(samplePosts);
    expect(result[0].id).toBe('post-updated'); // 2026-02-15
    expect(result[1].id).toBe('post-new'); // 2026-02-01
    expect(result[2].id).toBe('post-old'); // 2025-01-01
  });

  it('slices to requested count', () => {
    const result = getLatestPosts(samplePosts, 2);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(['post-updated', 'post-new']);
  });
});

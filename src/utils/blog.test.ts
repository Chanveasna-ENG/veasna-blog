import { describe, expect, it } from 'vitest';
import {
  type MinimalBlogPost,
  filterBlogPosts,
  getLatestPosts,
  sortBlogPostsByDate
} from './blog';

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
      id: 'post-project',
      data: {
        title: 'Project Case Study',
        description: 'Description for project case study.',
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
    },
    {
      id: 'post-learning',
      data: {
        title: 'Learning Note',
        description: 'Description for learning note.',
        createdAt: new Date('2026-01-10'),
        draft: false,
        category: 'learning'
      }
    }
  ];

  describe('filterBlogPosts', () => {
    it('filters out draft posts and project category posts', () => {
      const result = filterBlogPosts(samplePosts);
      expect(result.some((p) => p.data.draft)).toBe(false);
      expect(result.some((p) => p.data.category === 'project')).toBe(false);
      expect(result.map((p) => p.id)).toEqual([
        'post-old',
        'post-updated',
        'post-learning'
      ]);
    });
  });

  describe('sortBlogPostsByDate', () => {
    it('sorts posts descending by most recent date (createdAt or lastModifiedAt)', () => {
      const result = sortBlogPostsByDate(samplePosts);
      expect(result[0].id).toBe('post-draft'); // 2026-03-01
      expect(result[1].id).toBe('post-updated'); // 2026-02-15
      expect(result[2].id).toBe('post-project'); // 2026-02-01
      expect(result[3].id).toBe('post-learning'); // 2026-01-10
      expect(result[4].id).toBe('post-old'); // 2025-01-01
    });
  });

  describe('getLatestPosts', () => {
    it('composes filter and sort, excluding projects and drafts, and limits count', () => {
      const result = getLatestPosts(samplePosts, 2);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual([
        'post-updated',
        'post-learning'
      ]);
    });
  });
});

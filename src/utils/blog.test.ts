import { describe, expect, it } from 'vitest';
import {
  type MinimalBlogPost,
  calculateReadingTime,
  filterBlogPosts,
  formatReadingTime,
  getAdjacentPosts,
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
        category: 'blog'
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
      id: 'post-recent',
      data: {
        title: 'Recent Blog',
        description: 'Description for recent blog.',
        createdAt: new Date('2026-01-10'),
        draft: false,
        category: 'blog'
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
        'post-recent'
      ]);
    });
  });

  describe('sortBlogPostsByDate', () => {
    it('sorts posts descending by most recent date (createdAt or lastModifiedAt)', () => {
      const result = sortBlogPostsByDate(samplePosts);
      expect(result[0].id).toBe('post-draft'); // 2026-03-01
      expect(result[1].id).toBe('post-updated'); // 2026-02-15
      expect(result[2].id).toBe('post-project'); // 2026-02-01
      expect(result[3].id).toBe('post-recent'); // 2026-01-10
      expect(result[4].id).toBe('post-old'); // 2025-01-01
    });
  });

  describe('getLatestPosts', () => {
    it('composes filter and sort, excluding projects and drafts, and limits count', () => {
      const result = getLatestPosts(samplePosts, 2);
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toEqual(['post-updated', 'post-recent']);
    });
  });

  describe('calculateReadingTime', () => {
    it('calculates minutes based on 200 words per minute', () => {
      const text400Words = new Array(400).fill('word').join(' ');
      expect(calculateReadingTime(text400Words)).toBe(2);

      const text50Words = new Array(50).fill('word').join(' ');
      expect(calculateReadingTime(text50Words)).toBe(1);

      expect(calculateReadingTime(600)).toBe(3);
      expect(calculateReadingTime('')).toBe(1);
    });
  });

  describe('formatReadingTime', () => {
    it('formats minutes into standard string format', () => {
      expect(formatReadingTime(5)).toBe('5 min read');
      expect(formatReadingTime(1)).toBe('1 min read');
    });
  });

  describe('getAdjacentPosts', () => {
    it('finds previous and next post strictly within the same category', () => {
      // For 'post-recent' (date: 2026-01-10):
      // Newer blog post (next) is 'post-updated' (2026-02-15)
      // Older blog post (prev) is 'post-old' (2025-01-01)
      const { prevPost, nextPost } = getAdjacentPosts(
        'post-recent',
        samplePosts
      );
      expect(nextPost?.id).toBe('post-updated');
      expect(prevPost?.id).toBe('post-old');
    });

    it('returns null for nextPost when at the newest post in category', () => {
      const { prevPost, nextPost } = getAdjacentPosts(
        'post-updated',
        samplePosts
      );
      expect(nextPost).toBeNull();
      expect(prevPost?.id).toBe('post-recent');
    });

    it('returns null for prevPost when at the oldest post in category', () => {
      const { prevPost, nextPost } = getAdjacentPosts('post-old', samplePosts);
      expect(nextPost?.id).toBe('post-recent');
      expect(prevPost).toBeNull();
    });

    it('ignores posts from differing categories in navigation sequence', () => {
      // post-project is between post-updated and post-recent by date, but must not appear in blog navigation
      const { prevPost, nextPost } = getAdjacentPosts(
        'post-recent',
        samplePosts
      );
      expect(nextPost?.id).not.toBe('post-project');
      expect(prevPost?.id).not.toBe('post-project');
    });
  });
});

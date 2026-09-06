import { describe, expect, it } from 'vitest';
import {
  type SimilarityInput,
  calculateSimilarityScore,
  getTopSimilarPosts,
  tokenize
} from './similar-posts.utils';

describe('similar-posts.utils', () => {
  it('tokenizes text stripping punctuation and small words', () => {
    const tokens = tokenize('Hello, world! This is an Automation System.');
    expect(tokens).toEqual(['hello', 'world', 'this', 'automation', 'system']);
  });

  it('calculates score with tag and category weighting', () => {
    const current: SimilarityInput = {
      id: 'post-1',
      category: 'Architecture',
      tags: ['n8n', 'DevOps'],
      title: 'Enterprise Architecture',
      description: 'Scaling lead engines',
      createdAt: new Date('2026-01-01')
    };

    const target: SimilarityInput = {
      id: 'post-2',
      category: 'Architecture',
      tags: ['n8n', 'Cloud'],
      title: 'Enterprise Workflows',
      description: 'Managing lead funnels',
      createdAt: new Date('2026-01-02')
    };

    // Base: 1
    // Common tags: ['n8n'] -> 1 * 5 = 5
    // Same category: 3
    // Common title tokens: ['enterprise'] -> 1 * 2 = 2
    // Common desc tokens: ['lead'] -> 1 * 1 = 1
    // Total = 1 + 5 + 3 + 2 + 1 = 12
    const score = calculateSimilarityScore(current, target);
    expect(score).toBe(12);
  });

  it('filters out current post and sorts by similarity score then date', () => {
    const current: SimilarityInput = {
      id: 'current',
      category: 'Architecture',
      tags: ['n8n'],
      title: 'Main System',
      description: 'Base Description',
      createdAt: new Date('2026-01-01')
    };

    const targetA: SimilarityInput = {
      id: 'target-a',
      category: 'Architecture',
      tags: ['n8n'], // score higher
      title: 'Unrelated Title',
      description: 'Other words',
      createdAt: new Date('2026-01-02')
    };

    const targetB: SimilarityInput = {
      id: 'target-b',
      category: 'Different',
      tags: ['different'],
      title: 'Other Topic',
      description: 'Random',
      createdAt: new Date('2026-01-03')
    };

    const targetC: SimilarityInput = {
      id: 'current', // should be excluded
      category: 'Architecture',
      tags: ['n8n'],
      title: 'Main System',
      description: 'Base Description',
      createdAt: new Date('2026-01-01')
    };

    const top = getTopSimilarPosts(current, [targetA, targetB, targetC], 2);
    expect(top.map((p) => p.id)).toEqual(['target-a', 'target-b']);
  });
});

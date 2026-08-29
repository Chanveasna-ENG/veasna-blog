import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SearchFeed from './SearchFeed';

vi.mock('../../utils/search', () => ({
  search: vi.fn().mockResolvedValue([
    {
      url: '/posts/first-post',
      title: 'First Post Title',
      excerpt: 'Excerpt of first post',
      category: 'blog',
      date: '2026-08-29'
    }
  ])
}));

describe('SearchFeed component', () => {
  it('renders search feed heading with empty query initially', () => {
    render(<SearchFeed />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toContain('Here is what you are looking for');
  });
});

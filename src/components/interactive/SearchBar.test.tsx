import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from './SearchBar';

vi.mock('../../utils/search', () => ({
  search: vi.fn().mockResolvedValue([
    {
      url: '/posts/sample-post',
      title: 'Sample Post Title',
      excerpt: 'Sample post excerpt content'
    }
  ])
}));

describe('SearchBar component', () => {
  it('renders search open button initially', () => {
    render(<SearchBar />);
    const button = screen.getByLabelText('Open search');
    expect(button).toBeDefined();
  });

  it('expands search input on button click', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const button = screen.getByLabelText('Open search');
    await user.click(button);

    const input = screen.getByPlaceholderText('Search logs...');
    expect(input).toBeDefined();
  });
});

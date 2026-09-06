export interface MinimalBlogPost {
  id: string;
  data: {
    title: string;
    description: string;
    createdAt: Date;
    lastModifiedAt?: Date;
    tags?: string[];
    draft?: boolean;
    category: 'blog' | 'project' | 'participation' | 'learning' | 'random';
    [key: string]: unknown;
  };
}

export function filterBlogPosts<T extends MinimalBlogPost>(posts: T[]): T[] {
  return posts.filter(
    (post) => !post.data.draft && post.data.category !== 'project'
  );
}

export function sortBlogPostsByDate<T extends MinimalBlogPost>(
  posts: T[]
): T[] {
  return [...posts].sort((a, b) => {
    const dateA = (a.data.lastModifiedAt || a.data.createdAt).getTime();
    const dateB = (b.data.lastModifiedAt || b.data.createdAt).getTime();
    return dateB - dateA;
  });
}

export function getLatestPosts<T extends MinimalBlogPost>(
  posts: T[],
  count = 3
): T[] {
  return sortBlogPostsByDate(filterBlogPosts(posts)).slice(0, count);
}

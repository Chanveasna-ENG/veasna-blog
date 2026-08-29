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

export function getLatestPosts<T extends MinimalBlogPost>(
  posts: T[],
  count = 3
): T[] {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => {
      const dateA = (a.data.lastModifiedAt || a.data.createdAt).getTime();
      const dateB = (b.data.lastModifiedAt || b.data.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, count);
}

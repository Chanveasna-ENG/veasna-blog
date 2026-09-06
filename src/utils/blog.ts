export interface MinimalBlogPost {
  id: string;
  data: {
    title: string;
    description: string;
    createdAt: Date;
    lastModifiedAt?: Date;
    tags?: string[];
    draft?: boolean;
    category: 'blog' | 'project';
    [key: string]: unknown;
  };
}

const WORD_SPLIT_REGEX = /\s+/;

export function calculateReadingTime(
  contentOrWords: string | number,
  wpm = 200
): number {
  if (typeof contentOrWords === 'number') {
    return Math.max(1, Math.ceil(contentOrWords / wpm));
  }
  if (!contentOrWords?.trim()) {
    return 1;
  }
  const wordCount = contentOrWords
    .trim()
    .split(WORD_SPLIT_REGEX)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / wpm));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
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

export function getAdjacentPosts<T extends MinimalBlogPost>(
  currentPostId: string,
  allPosts: T[]
): { prevPost: T | null; nextPost: T | null } {
  const currentPost = allPosts.find((p) => p.id === currentPostId);
  if (!currentPost) {
    return { prevPost: null, nextPost: null };
  }

  // Filter strictly within same category and non-draft
  const categoryPosts = allPosts.filter(
    (post) =>
      !post.data.draft && post.data.category === currentPost.data.category
  );

  // Sort descending: index 0 is newest, last index is oldest
  const sorted = sortBlogPostsByDate(categoryPosts);
  const currentIndex = sorted.findIndex((p) => p.id === currentPostId);

  if (currentIndex === -1) {
    return { prevPost: null, nextPost: null };
  }

  // Next is newer (closer to index 0), Prev is older (higher index)
  const nextPost = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const prevPost =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return { prevPost, nextPost };
}

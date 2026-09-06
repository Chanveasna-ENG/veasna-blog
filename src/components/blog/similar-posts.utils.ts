export interface SimilarityInput {
  id: string;
  category?: string;
  tags?: string[];
  title: string;
  description: string;
  createdAt: Date;
  lastModifiedAt?: Date;
}

const PUNCTUATION_REGEX = /[^\w\s]/g;
const WHITESPACE_REGEX = /\s+/;

export function tokenize(text: string): string[] {
  if (!text) {
    return [];
  }
  return text
    .toLowerCase()
    .replace(PUNCTUATION_REGEX, '')
    .split(WHITESPACE_REGEX)
    .filter((word) => word.length > 3);
}

export function calculateSimilarityScore(
  current: SimilarityInput,
  target: SimilarityInput
): number {
  let score = 1;

  const currentTags = (current.tags || []).map((t) => t.toLowerCase());
  const targetTags = (target.tags || []).map((t) => t.toLowerCase());
  const commonTags = currentTags.filter((t) => targetTags.includes(t));
  score += commonTags.length * 5;

  if (
    current.category &&
    target.category &&
    current.category === target.category
  ) {
    score += 3;
  }

  const currentTitleTokens = tokenize(current.title);
  const targetTitleTokens = tokenize(target.title);
  const commonTitleTokens = currentTitleTokens.filter((t) =>
    targetTitleTokens.includes(t)
  );
  score += commonTitleTokens.length * 2;

  const currentDescTokens = tokenize(current.description);
  const targetDescTokens = tokenize(target.description);
  const commonDescTokens = currentDescTokens.filter((t) =>
    targetDescTokens.includes(t)
  );
  score += commonDescTokens.length * 1;

  return score;
}

export function getTopSimilarPosts<T extends SimilarityInput>(
  current: T,
  all: T[],
  limit = 3
): T[] {
  return all
    .filter(
      (post) =>
        post.id !== current.id &&
        (!current.category || post.category === current.category)
    )
    .map((post) => ({
      post,
      score: calculateSimilarityScore(current, post)
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      const dateA = a.post.lastModifiedAt || a.post.createdAt;
      const dateB = b.post.lastModifiedAt || b.post.createdAt;
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit)
    .map((item) => item.post);
}

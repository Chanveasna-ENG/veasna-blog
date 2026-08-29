export interface SearchResultItem {
  url: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
}

interface PagefindSearchResult {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta?: {
      title?: string;
      category?: string;
      date?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  }>;
}

interface PagefindInstance {
  search: (query: string) => Promise<{ results: PagefindSearchResult[] }>;
}

let pagefindPromise: Promise<PagefindInstance | null> | null = null;

export function initPagefind(): Promise<PagefindInstance | null> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (pagefindPromise) {
    return pagefindPromise;
  }

  pagefindPromise = (async () => {
    try {
      const pagefindPath = '/pagefind/pagefind.js';
      const pagefind = await import(/* @vite-ignore */ pagefindPath);
      if (pagefind && typeof pagefind.init === 'function') {
        await pagefind.init();
      }
      return pagefind as PagefindInstance;
    } catch {
      return null;
    }
  })();

  return pagefindPromise;
}

export async function search(
  query: string,
  limit?: number
): Promise<SearchResultItem[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const pagefind = await initPagefind();
  if (!pagefind || typeof pagefind.search !== 'function') {
    return [];
  }

  try {
    const searchResponse = await pagefind.search(trimmed);
    const rawResults = limit
      ? searchResponse.results.slice(0, limit)
      : searchResponse.results;

    const items = await Promise.all(
      rawResults.map(async (res) => {
        const data = await res.data();
        return {
          url: data.url,
          title: data.meta?.title || 'Untitled',
          excerpt: data.excerpt || '',
          category: data.meta?.category,
          date: data.meta?.date
        };
      })
    );

    return items;
  } catch {
    return [];
  }
}

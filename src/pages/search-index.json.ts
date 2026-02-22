import { getCollection } from 'astro:content';

/**
 * Defines the strict shape of the search index JSON.
 * This mirrors the client-side expectations for Fuse.js as per TRD 2.4.
 */
export interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  category: 'blog' | 'project' | 'participation' | 'learning' | 'random';
  tags: string[];
  author: string;
  date: string; // ISO String representation
}

/**
 * Astro API Endpoint handling GET requests to /search-index.json.
 * In SSG mode, this is executed once at build time to create a static file.
 */
export async function GET(): Promise<Response> {
  try {
    const posts = await getCollection('blog', (post) => !post.data.draft);

    const searchIndex: SearchIndexItem[] = posts.map((post) => {
      // Determine the most relevant date for sorting/display
      const targetDate = post.data.lastModifiedAt || post.data.createdAt;

      return {
        slug: post.slug,
        title: post.data.title,
        description: post.data.description,
        category: post.data.category,
        tags: post.data.tags,
        author: post.data.author,
        date: targetDate.toISOString()
      };
    });

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Failed to generate search index:', error);
    
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
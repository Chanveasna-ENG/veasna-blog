import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  // 1. Fetch all non-draft posts from the content collection
  const posts = await getCollection('blog', (post) => !post.data.draft);

  // 2. Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.data.lastModifiedAt || a.data.createdAt;
    const dateB = b.data.lastModifiedAt || b.data.createdAt;
    return dateB.getTime() - dateA.getTime();
  });

  // 3. Generate the RSS feed XML
  return rss({
    // `<title>` field in output xml
    title: 'Veasna. | Principal Technical Architect',
    // `<description>` field in output xml
    description: 'Building solutions for repetitive tasks with high-performance static architectures.',
    // Pulls from your astro.config.mjs `site` property
    site: context.site || 'https://veasnaec.com',
    // Array of `<item>`s in output xml
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.createdAt,
      description: post.data.description,
      // Compute the RSS item's link using the post's slug
      link: `/posts/${post.slug}/`,
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}
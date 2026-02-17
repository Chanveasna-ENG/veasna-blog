import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      // --- Universal Fields ---
      title: z.string().max(100, 'Title too long - keep under 100 chars for SEO'),
      description: z.string().min(20, 'Description too short for SEO - min 20 chars'),

      // Dates & Versioning
      createdAt: z.date(),
      lastModifiedAt: z.date().optional(),
      version: z.string().default('1'),
      author: z.string().default('Chanveasna ENG'),

      // Taxonomy
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),

      // Images
      // image() validates that the path exists in src/assets or public
      coverImage: image().optional(),
      coverAlt: z.string().optional(),

      // --- The Discriminator (TRD 2.2) ---
      category: z.enum(['blog', 'project', 'participation', 'learning', 'random']),

      // --- Type-Specific Fields ---
      // Optional to prevent build breaks during drafting, but typed for usage
      repoUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),

      // Participation/Event Specifics
      eventResult: z.string().optional(),
      eventLocation: z.string().optional(),
      eventDate: z.date().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
};

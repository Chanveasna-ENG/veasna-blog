import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    // --- Universal Fields (Applied to ALL types) ---
    title: z.string().max(100, "Title too long"),
    description: z.string().min(20, "Description too short for SEO"),
    createdAt: z.date(),
    lastModifiedAt: z.date().optional(),
    version: z.string().default('1.0.0'),
    author: z.string().default('Your Name'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    
    // Images
    coverImage: image().optional(),
    coverAlt: z.string().optional(),
    
    // --- The Discriminator ---
    category: z.enum(['blog', 'project', 'participation', 'learning', 'random']),
    
    // --- Type-Specific Fields (Optional but Typed) ---
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
// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: process.env.SITE_URL || 'https://example.com',

  integrations: [react(), sitemap(), mdx()],

  // Optimization: Image service configuration if needed later
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  // Build options
  build: {
    format: 'file',
  },
});

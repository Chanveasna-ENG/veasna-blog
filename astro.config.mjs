import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// [https://astro.build/config](https://astro.build/config)
export default defineConfig({
  site: 'https://veasnaec.com',
  output: 'static',

  integrations: [react(), mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});

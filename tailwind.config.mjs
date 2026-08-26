import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F7F4EC',
        parchmentDark: '#EFECE1',
        ink: '#1A1A1A',
        inkMuted: '#4A4237',
        // Deep Oxidized Antique Bronze (#4A2E0B) for strong contrast and classic medieval warmth
        bronze: '#4A2E0B',
        bronzeHover: '#2D1B06',
        crimson: '#5C0606',
        // Alias
        gold: '#4A2E0B',
        darkBg: '#1A1A1A',
        offWhite: '#F7F4EC',
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Cinzel', 'serif'],
        body: ['Lora', 'Inter', 'serif'],
        alice: ['"Cormorant Garamond"', 'Cinzel', 'serif'],
        serif: ['Lora', 'serif'],
      },
    },
  },
  plugins: [typography],
};
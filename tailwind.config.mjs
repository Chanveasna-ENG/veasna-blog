import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gold: '#B69328',
        darkBg: '#2D2D2D',
        offWhite: '#FEFEFE'
      },
      fontFamily: {
        // Using Alice for headings/accents and Times New Roman for body text (serif default)
        alice: ['Alice', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif']
      }
    }
  },
  plugins: [typography]
};
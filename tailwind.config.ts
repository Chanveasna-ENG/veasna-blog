/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				darkBg: '#2D2D2D',
				lightDark: '#4D4D4D',
				footerDark: '#3D3D3D',
				gold: '#B69328',
				offWhite: '#FEFEFE',
			},
			fontFamily: {
				// User requested Alice or Times New Roman
				serif: ['Alice', 'Times New Roman', 'serif'],
				sans: ['Inter', 'sans-serif'],
			},
			borderRadius: {
				// "Round corner 20px radius" requirement
				'xl': '20px', 
			}
		},
	},
	plugins: [],
};
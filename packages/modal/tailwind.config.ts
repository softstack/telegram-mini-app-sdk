import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.tsx'],
	theme: {
		fontFamily: {
			sans: ['DM Sans', 'sans-serif'],
		},
		extend: {
			backgroundColor: {
				light: '#fff',
				dark: '#262233',
			},
			colors: {
				primaryText: '#212121',
				primaryTextDark: '#dedede',
				success: '#4ade80',
				error: '#ef4444',
				line: '#717171',
				lineDark: '#fff',
				icon: '#717171',
				iconDark: '#fff',
				notActive: '#717171',
			},
			spacing: {
				pageFrame: '1.5rem',
			},
		},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
	darkMode: ['class', 'body[class~="dark-mode"]'],
} satisfies Config;

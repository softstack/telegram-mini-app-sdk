import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.tsx'],
	theme: {
		fontFamily: {
			sans: ['DM Sans', 'sans-serif'],
		},
		extend: {
			backgroundColor: {
				dark: '#262233',
			},
			colors: {
				lineGrey: '#717171',
				primaryText: '#212121',
				primaryTextDark: '#dedede',
				success: '#4ade80',
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

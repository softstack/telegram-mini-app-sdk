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
				inactive: '#919191',
				inactiveDark: '#717171',
				tezos: '#0063ff',
				etherlink: '#38ff9c',
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

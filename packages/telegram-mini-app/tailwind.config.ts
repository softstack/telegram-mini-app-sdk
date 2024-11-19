import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.tsx'],
	theme: {
		extend: {
			spacing: {
				pageFrame: '0.5rem',
				row: '0.75rem',
			},
		},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
} satisfies Config;

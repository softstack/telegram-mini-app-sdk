import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
	arrowParens: 'always', // Default 'always'
	bracketSameLine: false, // Default false
	bracketSpacing: true, // Default true
	embeddedLanguageFormatting: 'auto', // Default 'auto'
	endOfLine: 'lf', // Default 'lf'
	htmlWhitespaceSensitivity: 'css', // Default 'css'
	jsxSingleQuote: false, // Default false
	semi: true, // Default true
	singleAttributePerLine: false, // Default false
	singleQuote: true, // Default false
	printWidth: 120, // Default 80
	proseWrap: 'preserve', // Default 'preserve'
	quoteProps: 'as-needed', // Default 'as-needed'
	trailingComma: 'all', // Default 'all'
	useTabs: true, // Default false
	plugins: ['prettier-plugin-tailwindcss'],
	tailwindConfig: resolve(__dirname, './packages/modal/tailwind.config.ts'),
	tailwindFunctions: ['clsx', 'tw'],
};

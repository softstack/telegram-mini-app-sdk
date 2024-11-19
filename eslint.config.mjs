import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{
		ignores: [
			'**/build/**',
			'**/dist/**',
			'**/craco.config.ts',
			'packages/telegram-mini-app/live',
			'packages/wallet-opener/live',
		],
	},
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.strict,
	{
		...eslintPluginReact.configs.flat.recommended,
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		plugins: {
			'react-hooks': eslintPluginReactHooks,
		},
		rules: eslintPluginReactHooks.configs.recommended.rules,
	},
	eslintPluginUnicorn.configs['flat/recommended'],
	{
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'error',
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],
			'unicorn/no-await-expression-member': 'off',
			'unicorn/no-useless-undefined': 'off',
			'unicorn/prefer-ternary': 'off',
			'unicorn/prevent-abbreviations': [
				'error',
				{
					replacements: {
						arg: false,
						args: false,
						obj: false,
						params: false,
						prev: false,
						props: false,
						ref: false,
						src: false,
						tmp: false,
					},
				},
			],
		},
	},
	eslintConfigPrettier,
];

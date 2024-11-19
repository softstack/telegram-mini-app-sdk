import webpack from 'webpack';

export default {
	webpack: {
		configure: {
			module: {
				rules: [
					{
						test: /\.m?js$/,
						resolve: {
							fullySpecified: false,
						},
					},
				],
			},
			resolve: {
				fallback: {
					buffer: require.resolve('buffer/'),
					events: require.resolve('events/'),
					process: require.resolve('process/browser'),
					stream: require.resolve('stream-browserify'),
				},
			},
		},
		plugins: {
			add: [
				new webpack.ProvidePlugin({
					Buffer: ['buffer', 'Buffer'],
					process: 'process/browser',
				}),
			],
		},
	},
};

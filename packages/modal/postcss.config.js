// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const addPart = (className, part) => {
	if (className) {
		return part + ':' + className;
	}
	return part;
};

// eslint-disable-next-line unicorn/prefer-module
module.exports = {
	plugins: {
		'postcss-prefix-selector': {
			prefix: 'eotrzpirnbqlbfjhbqpo-',
			// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
			transform: function (prefix, selector, prefixedSelector, filePath) {
				if (!selector) {
					return selector;
				}
				if (filePath.includes('@ext')) {
					return selector;
				}
				const isClassname = selector.includes('.');
				if (!isClassname) {
					return selector;
				}
				const className = selector.replace('.', '');
				const parts = className.split(':');
				let classNameIndex = parts.length - 1;
				for (let index = parts.length - 1; index >= 0; index--) {
					if (!parts[index].startsWith('is(')) {
						classNameIndex = index;
						break;
					}
				}
				let prefixedClassName = '';
				for (let index = parts.length - 1; index >= 0; index--) {
					if (classNameIndex === index) {
						if (parts[index].startsWith(prefix)) {
							prefixedClassName = addPart(prefixedClassName, parts[index]);
							break;
						}
						if (parts[index].startsWith('-')) {
							prefixedClassName = addPart(prefixedClassName, '-' + prefix + parts[index].slice(1));
						} else {
							prefixedClassName = addPart(prefixedClassName, prefix + parts[index]);
						}
					} else {
						prefixedClassName = addPart(prefixedClassName, parts[index]);
					}
				}
				return '.' + prefixedClassName;
			},
		},
	},
};

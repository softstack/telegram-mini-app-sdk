const MAGIC_COLON_COLON = 'xxyhfothndyfwhxhmwek';

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
				if (!selector.includes('.')) {
					return selector;
				}
				const selectorParts = selector.split(' ');
				let prefixedClassNames = '';
				for (const selectorPart of selectorParts) {
					if (selectorPart.startsWith('.')) {
						const parts = selectorPart.replace('.', '').replaceAll('::', MAGIC_COLON_COLON).split(':');
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
						if (prefixedClassNames) {
							prefixedClassNames += ' ';
						}
						prefixedClassNames += '.' + prefixedClassName.replaceAll(MAGIC_COLON_COLON, '::');
					} else {
						if (prefixedClassNames) {
							prefixedClassNames += ' ';
						}
						prefixedClassNames += selectorPart;
					}
				}
				return prefixedClassNames;
			},
		},
	},
};

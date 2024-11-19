import { useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { TAILWIND_PREFIX } from './constants';

export const createTailwindPrefixer = (prefix: string, separator = ':') => {
	return (...args: Array<false | string | undefined>): string => {
		let className = '';
		const cssClasses = twMerge(args).split(' ').filter(Boolean);
		for (const cssClass of cssClasses) {
			const parts = cssClass.split(separator);
			let prefixedCssClass = '';
			for (let index = parts.length - 1; index >= 0; index--) {
				if (parts.length - 1 === index) {
					if (parts[index].startsWith(prefix)) {
						prefixedCssClass = cssClass;
						break;
					}
					if (parts[index].startsWith('-')) {
						prefixedCssClass = '-' + prefix + parts[index].slice(1);
					} else {
						prefixedCssClass = prefix + parts[index];
					}
				} else {
					prefixedCssClass = parts[index] + separator + prefixedCssClass;
				}
			}
			className += (className && ' ') + prefixedCssClass;
		}

		return className;
	};
};

export const tw = createTailwindPrefixer(TAILWIND_PREFIX);

let version = 0;
export const nextVersion = (): number => ++version;

export const useVersionedState = <T>(
	value: T,
): readonly [T, (version: number, action: ((prevValue: T) => T) | T) => void] => {
	const [getter, setter] = useState<{ value: T; version: number }>({ value, version: nextVersion() });

	const wrappedSetter = useCallback((newVersion: number, action: ((prevValue: T) => T) | T) => {
		setter((prevValue) => {
			if (newVersion > prevValue.version) {
				return {
					value: typeof action === 'function' ? (action as (prevValue: T) => T)(prevValue.value) : action,
					version: newVersion,
				};
			}
			return prevValue;
		});
	}, []);

	return useMemo(() => [getter.value, wrappedSetter], [getter.value, wrappedSetter]);
};

export const useDarkMode = (): boolean => {
	const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark-mode'));

	useEffect(() => {
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === 'class') {
					setDarkMode(document.body.classList.contains('dark-mode'));
				}
			}
		});
		observer.observe(document.body, { attributeFilter: ['class'] });
		return (): void => observer.disconnect();
	}, []);

	return darkMode;
};

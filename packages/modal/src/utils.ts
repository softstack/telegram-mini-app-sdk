import { useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { TAILWIND_PREFIX } from './constants';

/**
 * Creates a function that prefixes Tailwind CSS class names with a specified prefix.
 *
 * @param prefix - The prefix to add to each Tailwind CSS class name.
 * @param separator - The separator used to split and join class name parts. Defaults to ':'.
 * @returns A function that takes a variable number of class names (or false/undefined values) and returns a single string with the prefixed class names.
 *
 * @example
 * ```typescript
 * const prefixer = createTailwindPrefixer('tw-');
 * const className = prefixer('bg-red-500', 'text-white');
 * console.log(className); // Outputs: 'tw-bg-red-500 tw-text-white'
 * ```
 */
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
/**
 * Increments the current version number by one and returns the new version.
 *
 * @returns {number} The incremented version number.
 */
export const nextVersion = (): number => ++version;

/**
 * A custom hook that manages state with versioning. It ensures that state updates
 * are only applied if the new version is greater than the current version.
 *
 * @template T - The type of the state value.
 * @param value - The initial state value.
 * @returns A tuple containing the current state value and a setter function.
 *
 * The setter function takes two arguments:
 * - `version`: The version number associated with the new state.
 * - `action`: A function that takes the previous state value and returns the new state value,
 *   or the new state value directly.
 *
 * @example
 * const [state, setState] = useVersionedState(initialValue);
 *
 * // Update state with a new version
 * setState(newVersion, (prevValue) => newValue);
 *
 * // Update state directly with a new version
 * setState(newVersion, newValue);
 */
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

/**
 * Custom hook that detects if the document body has the 'dark-mode' class.
 * It sets up a MutationObserver to listen for changes to the class attribute
 * on the document body and updates the state accordingly.
 *
 * @returns {boolean} - Returns `true` if the 'dark-mode' class is present on the document body, otherwise `false`.
 */
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

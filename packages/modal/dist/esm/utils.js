import { useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { TAILWIND_PREFIX } from './constants';
export const createTailwindPrefixer = (prefix, separator = ':') => {
    return (...args) => {
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
                    }
                    else {
                        prefixedCssClass = prefix + parts[index];
                    }
                }
                else {
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
export const nextVersion = () => ++version;
export const useVersionedState = (value) => {
    const [getter, setter] = useState({ value, version: nextVersion() });
    const wrappedSetter = useCallback((newVersion, action) => {
        setter((prevValue) => {
            if (newVersion > prevValue.version) {
                return {
                    value: typeof action === 'function' ? action(prevValue.value) : action,
                    version: newVersion,
                };
            }
            return prevValue;
        });
    }, []);
    return useMemo(() => [getter.value, wrappedSetter], [getter.value, wrappedSetter]);
};
export const useDarkMode = () => {
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
        return () => observer.disconnect();
    }, []);
    return darkMode;
};
//# sourceMappingURL=utils.js.map
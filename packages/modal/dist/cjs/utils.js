"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.useDarkMode = exports.useVersionedState = exports.nextVersion = exports.tw = exports.createTailwindPrefixer = void 0;
const react_1 = require("react");
const react_toastify_1 = require("react-toastify");
const tailwind_merge_1 = require("tailwind-merge");
const constants_1 = require("./constants");
const createTailwindPrefixer = (prefix, separator = ':') => {
    return (...args) => {
        let className = '';
        const cssClasses = (0, tailwind_merge_1.twMerge)(args).split(' ').filter(Boolean);
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
exports.createTailwindPrefixer = createTailwindPrefixer;
exports.tw = (0, exports.createTailwindPrefixer)(constants_1.TAILWIND_PREFIX);
let version = 0;
const nextVersion = () => ++version;
exports.nextVersion = nextVersion;
const useVersionedState = (value) => {
    const [getter, setter] = (0, react_1.useState)({ value, version: (0, exports.nextVersion)() });
    const wrappedSetter = (0, react_1.useCallback)((newVersion, action) => {
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
    return (0, react_1.useMemo)(() => [getter.value, wrappedSetter], [getter.value, wrappedSetter]);
};
exports.useVersionedState = useVersionedState;
const useDarkMode = () => {
    const [darkMode, setDarkMode] = (0, react_1.useState)(document.body.classList.contains('dark-mode'));
    (0, react_1.useEffect)(() => {
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
exports.useDarkMode = useDarkMode;
const handleError = (error) => {
    if (error instanceof Error) {
        react_toastify_1.toast.error(error.message, { containerId: constants_1.TOAST_CONTAINER_ID });
    }
    else {
        console.error(error);
    }
};
exports.handleError = handleError;
//# sourceMappingURL=utils.js.map
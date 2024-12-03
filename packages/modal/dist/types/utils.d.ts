export declare const createTailwindPrefixer: (prefix: string, separator?: string) => (...args: Array<false | string | undefined>) => string;
export declare const tw: (...args: Array<false | string | undefined>) => string;
export declare const nextVersion: () => number;
export declare const useVersionedState: <T>(value: T) => readonly [T, (version: number, action: ((prevValue: T) => T) | T) => void];
export declare const useDarkMode: () => boolean;
export declare const handleError: (error: unknown) => void;

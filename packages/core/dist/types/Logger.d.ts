import { Location } from 'get-current-line';
export type LogChannel = 'debug' | 'error' | 'info' | 'verbose' | 'warning';
export declare class Logger<T extends string = LogChannel> {
    constructor(activeChannels?: Array<LogChannel | T>);
    private _activeChannels;
    setChannelActive(channel: LogChannel | T, active: boolean): void;
    isChannelActive(channel: LogChannel | T): boolean;
    getActiveChannels(): Array<LogChannel | T>;
    log(logChannel: LogChannel | T, ...optionalParameters: unknown[]): void;
    logDebug: (location: Location, message: unknown, ...optionalParameters: unknown[]) => void;
    logError(location: Location, error: unknown, options?: {
        prefix?: string;
        key?: string;
    }, ...optionalParameters: unknown[]): void;
    logInfo(message: unknown, ...optionalParameters: unknown[]): void;
    logVerbose(message: unknown, ...optionalParameters: unknown[]): void;
    logWarning(message: unknown, ...optionalParameters: unknown[]): void;
    private _getLocationString;
}

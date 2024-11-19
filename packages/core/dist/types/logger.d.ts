import { Location } from 'get-current-line';
export type LogChannel = 'debug' | 'error' | 'info' | 'verbose' | 'warning';
export declare class Logger<T extends string = LogChannel> {
    constructor(activeChannels?: Array<LogChannel | T>);
    private _activeChannels;
    setChannelActive(channel: LogChannel | T, active: boolean): void;
    isChannelActive(channel: LogChannel | T): boolean;
    getActiveChannels(): Array<LogChannel | T>;
    log(logChannel: LogChannel | T, ...optionalParameters: unknown[]): void;
    /**
     * Logs a debug message.
     * @param location - The location where the log message originated from.
     * @param message - The optional message to be logged.
     */
    logDebug: (location: Location, message: unknown, ...optionalParameters: unknown[]) => void;
    /**
     * Logs an error message.
     * @param location - The location where the error occurred.
     * @param error - The error to be logged.
     * @param prefix - An optional prefix for the error message.
     */
    logError(location: Location, error: unknown, options?: {
        prefix?: string;
        key?: string;
    }, ...optionalParameters: unknown[]): void;
    /**
     * Logs an informational message.
     * @param message - The optional message to be logged.
     */
    logInfo(message: unknown, ...optionalParameters: unknown[]): void;
    logVerbose(message: unknown, ...optionalParameters: unknown[]): void;
    logWarning(message: unknown, ...optionalParameters: unknown[]): void;
    private _getLocationString;
}

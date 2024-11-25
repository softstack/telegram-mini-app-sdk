import { Location, getLocationFromError } from 'get-current-line';

/**
 * Represents the different levels of logging channels available.
 *
 * @typedef {('debug' | 'error' | 'info' | 'verbose' | 'warning')} LogChannel
 *
 * @property {'debug'} debug - Detailed information, typically of interest only when diagnosing problems.
 * @property {'error'} error - Error conditions.
 * @property {'info'} info - Informational messages that highlight the progress of the application at coarse-grained level.
 * @property {'verbose'} verbose - Detailed information on the flow through the system.
 * @property {'warning'} warning - Potentially harmful situations.
 */
export type LogChannel = 'debug' | 'error' | 'info' | 'verbose' | 'warning';

/**
 * A logger class that provides methods to log messages to different channels.
 *
 * @template T - The type of log channels, defaults to `LogChannel`.
 */
export class Logger<T extends string = LogChannel> {
	constructor(activeChannels: Array<LogChannel | T> = []) {
		for (const channel of activeChannels) {
			this.setChannelActive(channel, true);
		}
	}

	/**
	 * A set that holds the active logging channels.
	 *
	 * @private
	 */
	private _activeChannels = new Set<LogChannel | T>();

	/**
	 * Sets the active state of a specified logging channel.
	 *
	 * @param channel - The logging channel to be activated or deactivated. It can be of type `LogChannel` or `T`.
	 * @param active - A boolean indicating whether the channel should be active (`true`) or inactive (`false`).
	 *
	 * @returns void
	 */
	setChannelActive(channel: LogChannel | T, active: boolean): void {
		if (active) {
			this._activeChannels.add(channel);
		} else {
			this._activeChannels.delete(channel);
		}
	}

	/**
	 * Checks if the specified log channel is currently active.
	 *
	 * @param channel - The log channel to check. It can be of type `LogChannel` or `T`.
	 * @returns `true` if the channel is active, otherwise `false`.
	 */
	isChannelActive(channel: LogChannel | T): boolean {
		return this._activeChannels.has(channel);
	}

	/**
	 * Retrieves the currently active log channels.
	 *
	 * @template T - The type of additional log channels.
	 * @returns {Array<LogChannel | T>} An array containing the active log channels.
	 */
	getActiveChannels(): Array<LogChannel | T> {
		return [...this._activeChannels];
	}

	/**
	 * Logs a message to the console if the specified log channel is active.
	 *
	 * @param logChannel - The channel to log the message to. Can be a `LogChannel` or a custom type `T`.
	 * @param optionalParameters - Additional parameters to log.
	 */
	log(logChannel: LogChannel | T, ...optionalParameters: unknown[]): void {
		if (this.isChannelActive(logChannel)) {
			const logPrefix = `${new Date().toISOString()} ${logChannel.toUpperCase()}`;
			if (logChannel === 'error') {
				console.error(logPrefix, ...optionalParameters);
			} else {
				console.log(logPrefix, ...optionalParameters);
			}
		}
	}

	/**
	 * Logs a debug message with the specified location and optional parameters.
	 *
	 * @param location - The location where the log is being generated.
	 * @param message - The main message to log.
	 * @param optionalParameters - Additional optional parameters to include in the log.
	 * @returns void
	 */
	logDebug = (location: Location, message: unknown, ...optionalParameters: unknown[]): void => {
		this.log('debug', `${this._getLocationString(location)}`, message, ...optionalParameters);
	};

	/**
	 * Logs an error message with optional parameters and location information.
	 *
	 * @param location - The location where the error occurred.
	 * @param error - The error object or message to be logged.
	 * @param options - Optional parameters for additional logging details.
	 * @param options.prefix - An optional prefix to be added to the log message.
	 * @param options.key - An optional key to be added to the log message.
	 * @param optionalParameters - Additional parameters to be logged.
	 */
	logError(
		location: Location,
		error: unknown,
		options?: { prefix?: string; key?: string },
		...optionalParameters: unknown[]
	): void {
		if (this.isChannelActive('error')) {
			let locationString = 'unknown location';
			if (error instanceof Error) {
				const errorLocation = getLocationFromError(error as Error);
				locationString = this._getLocationString(errorLocation);
			}
			const prefixes = [`${this._getLocationString(location)} -> ${locationString}`];
			if (options?.key) {
				prefixes.push(options.key);
			}
			if (options?.prefix) {
				prefixes.push(options.prefix.trim());
			}
			this.log('error', ...prefixes, error, ...optionalParameters);
		}
	}

	/**
	 * Logs an informational message.
	 *
	 * @param message - The message to log. Can be of any type.
	 * @param optionalParameters - Additional optional parameters to log.
	 */
	logInfo(message: unknown, ...optionalParameters: unknown[]): void {
		this.log('info', message, ...optionalParameters);
	}

	/**
	 * Logs a verbose message.
	 *
	 * @param message - The primary message to log. Can be of any type.
	 * @param optionalParameters - Additional optional parameters to log. Can be of any type.
	 * @returns void
	 */
	logVerbose(message: unknown, ...optionalParameters: unknown[]): void {
		this.log('verbose', message, ...optionalParameters);
	}

	/**
	 * Logs a warning message.
	 *
	 * @param message - The main message to log. Can be of any type.
	 * @param optionalParameters - Additional optional parameters to log.
	 */
	logWarning(message: unknown, ...optionalParameters: unknown[]): void {
		this.log('warning', message, ...optionalParameters);
	}

	/**
	 * Constructs a string representation of a given location.
	 *
	 * @private
	 * @param location - The location object containing file, line, and method information.
	 * @returns A string in the format `file:line:method`.
	 */
	private _getLocationString(location: Location): string {
		return `${location.file}:${location.line}:${location.method}`;
	}
}

import { Location, getLocationFromError } from 'get-current-line';

export type LogChannel = 'debug' | 'error' | 'info' | 'verbose' | 'warning';

export class Logger<T extends string = LogChannel> {
	constructor(activeChannels: Array<LogChannel | T> = []) {
		for (const channel of activeChannels) {
			this.setChannelActive(channel, true);
		}
	}

	private _activeChannels = new Set<LogChannel | T>();

	setChannelActive(channel: LogChannel | T, active: boolean): void {
		if (active) {
			this._activeChannels.add(channel);
		} else {
			this._activeChannels.delete(channel);
		}
	}

	isChannelActive(channel: LogChannel | T): boolean {
		return this._activeChannels.has(channel);
	}

	getActiveChannels(): Array<LogChannel | T> {
		return [...this._activeChannels];
	}

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
	 * Logs a debug message.
	 * @param location - The location where the log message originated from.
	 * @param message - The optional message to be logged.
	 */
	logDebug = (location: Location, message: unknown, ...optionalParameters: unknown[]): void => {
		this.log('debug', `${this._getLocationString(location)}`, message, ...optionalParameters);
	};

	/**
	 * Logs an error message.
	 * @param location - The location where the error occurred.
	 * @param error - The error to be logged.
	 * @param prefix - An optional prefix for the error message.
	 */
	logError(
		location: Location,
		error: unknown,
		options?: { prefix?: string; key?: string },
		...optionalParameters: unknown[]
	): void {
		if (this.isChannelActive('error')) {
			const errorLocation = getLocationFromError(error as Error);
			const prefixes = [`${this._getLocationString(location)} -> ${this._getLocationString(errorLocation)}`];
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
	 * @param message - The optional message to be logged.
	 */
	logInfo(message: unknown, ...optionalParameters: unknown[]): void {
		this.log('info', message, ...optionalParameters);
	}

	logVerbose(message: unknown, ...optionalParameters: unknown[]): void {
		this.log('verbose', message, ...optionalParameters);
	}

	logWarning(message: unknown, ...optionalParameters: unknown[]): void {
		this.log('warning', message, ...optionalParameters);
	}

	private _getLocationString(location: Location): string {
		return `${location.file}:${location.line}:${location.method}`;
	}
}

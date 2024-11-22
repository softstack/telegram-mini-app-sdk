import { getLocationFromError } from 'get-current-line';
export class Logger {
    constructor(activeChannels = []) {
        this._activeChannels = new Set();
        this.logDebug = (location, message, ...optionalParameters) => {
            this.log('debug', `${this._getLocationString(location)}`, message, ...optionalParameters);
        };
        for (const channel of activeChannels) {
            this.setChannelActive(channel, true);
        }
    }
    setChannelActive(channel, active) {
        if (active) {
            this._activeChannels.add(channel);
        }
        else {
            this._activeChannels.delete(channel);
        }
    }
    isChannelActive(channel) {
        return this._activeChannels.has(channel);
    }
    getActiveChannels() {
        return [...this._activeChannels];
    }
    log(logChannel, ...optionalParameters) {
        if (this.isChannelActive(logChannel)) {
            const logPrefix = `${new Date().toISOString()} ${logChannel.toUpperCase()}`;
            if (logChannel === 'error') {
                console.error(logPrefix, ...optionalParameters);
            }
            else {
                console.log(logPrefix, ...optionalParameters);
            }
        }
    }
    logError(location, error, options, ...optionalParameters) {
        if (this.isChannelActive('error')) {
            const errorLocation = getLocationFromError(error);
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
    logInfo(message, ...optionalParameters) {
        this.log('info', message, ...optionalParameters);
    }
    logVerbose(message, ...optionalParameters) {
        this.log('verbose', message, ...optionalParameters);
    }
    logWarning(message, ...optionalParameters) {
        this.log('warning', message, ...optionalParameters);
    }
    _getLocationString(location) {
        return `${location.file}:${location.line}:${location.method}`;
    }
}
//# sourceMappingURL=logger.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const get_current_line_1 = require("get-current-line");
class Logger {
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
            let locationString = 'unknown location';
            if (error instanceof Error) {
                const errorLocation = (0, get_current_line_1.getLocationFromError)(error);
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
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map
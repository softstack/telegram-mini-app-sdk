export const hasOwnProperty = (object, property) => Object.prototype.hasOwnProperty.call(object, property);
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const joinUrl = (...parts) => {
    let url = '';
    for (let part of parts) {
        if (url) {
            if (url.endsWith('/')) {
                url = url.slice(0, -1);
            }
            if (part.startsWith('/')) {
                part = part.slice(1);
            }
            url = `${url}/${part}`;
        }
        else {
            url = part;
        }
    }
    return url;
};
export const toEventListener = (handler) => (event) => {
    handler(event.detail);
};
//# sourceMappingURL=base.js.map
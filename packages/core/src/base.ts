export const hasOwnProperty = <X, Y extends PropertyKey>(object: X, property: Y): object is X & Record<Y, unknown> =>
	Object.prototype.hasOwnProperty.call(object, property);

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const joinUrl = (...parts: Array<string>): string => {
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
		} else {
			url = part;
		}
	}
	return url;
};

export const toEventListener =
	<Payload>(handler: (payload: Payload) => void) =>
	(event: Event): void => {
		handler((event as CustomEvent<Payload>).detail);
	};

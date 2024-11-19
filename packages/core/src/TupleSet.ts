export class TupleSet<A, B> {
	private _map = new Map<A, Set<B>>();

	constructor(entries?: Array<[A, B]>) {
		if (entries) {
			for (const [a, b] of entries) {
				this.add(a, b);
			}
		}
	}

	add(a: A, b: B): this {
		if (!this.has(a, b)) {
			if (this._map.has(a)) {
				this._map.get(a)?.add(b);
			} else {
				this._map.set(a, new Set([b]));
			}
		}
		return this;
	}

	has(a: A, b: B): boolean {
		return this._map.get(a)?.has(b) ?? false;
	}

	delete(a: A, b: B): this {
		if (this.has(a, b)) {
			this._map.get(a)?.delete(b);
			if (this._map.get(a)?.size === 0) {
				this._map.delete(a);
			}
		}
		return this;
	}

	clear(): this {
		this._map.clear();
		return this;
	}

	entries(): IterableIterator<[A, B]> {
		const entries: Array<[A, B]> = [];
		for (const [a, setB] of this._map.entries()) {
			for (const b of setB) {
				entries.push([a, b]);
			}
		}
		return entries[Symbol.iterator]();
	}

	[Symbol.iterator](): IterableIterator<[A, B]> {
		return this.entries();
	}

	get size(): number {
		let size = 0;
		for (const setB of this._map.values()) {
			size += setB.size;
		}
		return size;
	}
}

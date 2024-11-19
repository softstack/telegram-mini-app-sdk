export class TupleMap<Key1, Key2, Value> {
	private _map = new Map<Key1, Map<Key2, Value>>();

	set(key1: Key1, key2: Key2, value: Value): this {
		const innerMap = this._map.get(key1);
		if (innerMap) {
			innerMap.set(key2, value);
		} else {
			const newInnerMap = new Map<Key2, Value>();
			newInnerMap.set(key2, value);
			this._map.set(key1, newInnerMap);
		}
		return this;
	}

	has(key1: Key1, key2: Key2): boolean {
		return this._map.get(key1)?.has(key2) ?? false;
	}

	get(key1: Key1, key2: Key2): Value | undefined {
		return this._map.get(key1)?.get(key2);
	}

	delete(key1: Key1, key2: Key2): this {
		const innerMap = this._map.get(key1);
		if (innerMap) {
			innerMap.delete(key2);
			if (innerMap.size === 0) {
				this._map.delete(key1);
			}
		}
		return this;
	}

	clear(): this {
		this._map.clear();
		return this;
	}

	entries(): IterableIterator<[Key1, Key2, Value]> {
		const entries: Array<[Key1, Key2, Value]> = [];
		for (const [key1, innerMap] of this._map.entries()) {
			for (const [key2, value] of innerMap.entries()) {
				entries.push([key1, key2, value]);
			}
		}
		return entries[Symbol.iterator]();
	}

	[Symbol.iterator](): IterableIterator<[Key1, Key2, Value]> {
		return this.entries();
	}

	get size(): number {
		let size = 0;
		for (const innerMap of this._map.values()) {
			size += innerMap.size;
		}
		return size;
	}
}

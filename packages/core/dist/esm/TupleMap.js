export class TupleMap {
    constructor(entries) {
        this._map = new Map();
        if (entries) {
            for (const [key1, key2, value] of entries) {
                this.set(key1, key2, value);
            }
        }
    }
    set(key1, key2, value) {
        const innerMap = this._map.get(key1);
        if (innerMap) {
            innerMap.set(key2, value);
        }
        else {
            const newInnerMap = new Map();
            newInnerMap.set(key2, value);
            this._map.set(key1, newInnerMap);
        }
        return this;
    }
    has(key1, key2) {
        return this._map.get(key1)?.has(key2) ?? false;
    }
    get(key1, key2) {
        return this._map.get(key1)?.get(key2);
    }
    delete(key1, key2) {
        const innerMap = this._map.get(key1);
        if (innerMap) {
            innerMap.delete(key2);
            if (innerMap.size === 0) {
                this._map.delete(key1);
            }
        }
        return this;
    }
    clear() {
        for (const innerMap of this._map.values()) {
            innerMap.clear();
        }
        this._map.clear();
        return this;
    }
    entries() {
        const entries = [];
        for (const [key1, innerMap] of this._map.entries()) {
            for (const [key2, value] of innerMap.entries()) {
                entries.push([key1, key2, value]);
            }
        }
        return entries[Symbol.iterator]();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    get size() {
        let size = 0;
        for (const innerMap of this._map.values()) {
            size += innerMap.size;
        }
        return size;
    }
}
//# sourceMappingURL=TupleMap.js.map
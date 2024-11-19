"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleSet = void 0;
class TupleSet {
    constructor(entries) {
        this._map = new Map();
        if (entries) {
            for (const [a, b] of entries) {
                this.add(a, b);
            }
        }
    }
    add(a, b) {
        if (!this.has(a, b)) {
            if (this._map.has(a)) {
                this._map.get(a)?.add(b);
            }
            else {
                this._map.set(a, new Set([b]));
            }
        }
        return this;
    }
    has(a, b) {
        return this._map.get(a)?.has(b) ?? false;
    }
    delete(a, b) {
        if (this.has(a, b)) {
            this._map.get(a)?.delete(b);
            if (this._map.get(a)?.size === 0) {
                this._map.delete(a);
            }
        }
        return this;
    }
    clear() {
        this._map.clear();
        return this;
    }
    entries() {
        const entries = [];
        for (const [a, setB] of this._map.entries()) {
            for (const b of setB) {
                entries.push([a, b]);
            }
        }
        return entries[Symbol.iterator]();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    get size() {
        let size = 0;
        for (const setB of this._map.values()) {
            size += setB.size;
        }
        return size;
    }
}
exports.TupleSet = TupleSet;
//# sourceMappingURL=TupleSet.js.map
export declare class TupleMap<Key1, Key2, Value> {
    private _map;
    set(key1: Key1, key2: Key2, value: Value): this;
    has(key1: Key1, key2: Key2): boolean;
    get(key1: Key1, key2: Key2): Value | undefined;
    delete(key1: Key1, key2: Key2): this;
    clear(): this;
    entries(): IterableIterator<[Key1, Key2, Value]>;
    [Symbol.iterator](): IterableIterator<[Key1, Key2, Value]>;
    get size(): number;
}

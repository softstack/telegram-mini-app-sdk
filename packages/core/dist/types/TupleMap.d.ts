/**
 * A `TupleMap` is a data structure that allows you to store values associated with a pair of keys.
 * It uses a nested `Map` to achieve this, where the first key maps to another `Map` that maps the second key to the value.
 *
 * @template Key1 - The type of the first key.
 * @template Key2 - The type of the second key.
 * @template Value - The type of the value.
 */
export declare class TupleMap<Key1, Key2, Value> {
    /**
     * Constructs a new TupleMap instance.
     *
     * @param entries - An optional array of tuples, where each tuple contains two keys and a value.
     *                  The keys and value will be added to the map.
     */
    constructor(entries?: Array<[Key1, Key2, Value]>);
    /**
     * A private map that stores a nested map structure.
     * The outer map uses keys of type `Key1` and maps to inner maps.
     * The inner maps use keys of type `Key2` and map to values of type `Value`.
     * This structure allows for a two-level key-value mapping.
     */
    private _map;
    /**
     * Sets a value in the tuple map for the given keys.
     *
     * @param key1 - The first key of the tuple.
     * @param key2 - The second key of the tuple.
     * @param value - The value to set for the given keys.
     * @returns The current instance of the tuple map.
     */
    set(key1: Key1, key2: Key2, value: Value): this;
    /**
     * Checks if the map contains the specified keys.
     *
     * @param key1 - The first key to check in the map.
     * @param key2 - The second key to check in the nested map.
     * @returns `true` if the map contains the specified keys, otherwise `false`.
     */
    has(key1: Key1, key2: Key2): boolean;
    /**
     * Retrieves the value associated with the specified keys from the tuple map.
     *
     * @param key1 - The first key of the tuple.
     * @param key2 - The second key of the tuple.
     * @returns The value associated with the specified keys, or `undefined` if no value is found.
     */
    get(key1: Key1, key2: Key2): Value | undefined;
    /**
     * Deletes the entry associated with the given keys from the map.
     *
     * @param key1 - The first key of the entry to delete.
     * @param key2 - The second key of the entry to delete.
     * @returns The current instance of the map.
     */
    delete(key1: Key1, key2: Key2): this;
    /**
     * Clears all entries in the map.
     *
     * @returns {this} The current instance for method chaining.
     */
    clear(): this;
    /**
     * Returns an iterable iterator of all entries in the TupleMap.
     * Each entry is a tuple containing the first key, the second key, and the value.
     *
     * @returns {IterableIterator<[Key1, Key2, Value]>} An iterable iterator of tuples,
     * each containing a key from the outer map, a key from the inner map, and the corresponding value.
     */
    entries(): IterableIterator<[Key1, Key2, Value]>;
    /**
     * Returns an iterator that yields tuples of [Key1, Key2, Value].
     * This allows the TupleMap to be iterable using the `for...of` syntax.
     *
     * @returns {IterableIterator<[Key1, Key2, Value]>} An iterator over the entries of the TupleMap.
     */
    [Symbol.iterator](): IterableIterator<[Key1, Key2, Value]>;
    /**
     * Gets the total number of elements in the TupleMap.
     *
     * @returns {number} The total number of elements.
     */
    get size(): number;
}

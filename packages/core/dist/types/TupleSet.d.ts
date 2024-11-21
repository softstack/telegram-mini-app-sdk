/**
 * A class representing a set of tuples, where each tuple consists of two elements.
 * The first element is used as the key in a Map, and the second element is stored in a Set associated with that key.
 * This allows for efficient storage and retrieval of pairs of values.
 *
 * @template A - The type of the first element in the tuple.
 * @template B - The type of the second element in the tuple.
 */
export declare class TupleSet<A, B> {
    /**
     * Creates an instance of TupleSet.
     *
     * @param entries - An optional array of tuples, where each tuple contains two elements of types A and B.
     *                  If provided, each tuple will be added to the set.
     */
    constructor(entries?: Array<[A, B]>);
    /**
     * A private map that associates keys of type `A` with sets of values of type `B`.
     * This map is used to store a collection of sets, where each set is associated with a unique key.
     *
     * @private
     */
    private _map;
    /**
     * Adds a tuple (a, b) to the set if it does not already exist.
     *
     * @param a - The first element of the tuple.
     * @param b - The second element of the tuple.
     * @returns The current instance of the TupleSet.
     */
    add(a: A, b: B): this;
    /**
     * Checks if the tuple (a, b) exists in the set.
     *
     * @param a - The first element of the tuple.
     * @param b - The second element of the tuple.
     * @returns `true` if the tuple (a, b) exists in the set, otherwise `false`.
     */
    has(a: A, b: B): boolean;
    /**
     * Deletes the tuple (a, b) from the set.
     *
     * @param a - The first element of the tuple to delete.
     * @param b - The second element of the tuple to delete.
     * @returns The current instance of the TupleSet.
     */
    delete(a: A, b: B): this;
    /**
     * Clears all entries from the TupleSet.
     *
     * @returns {this} The current instance of the TupleSet.
     */
    clear(): this;
    /**
     * Returns an iterable iterator of tuples containing elements from the set.
     * Each tuple consists of an element from the first set and an element from the second set.
     *
     * @returns {IterableIterator<[A, B]>} An iterable iterator of tuples.
     */
    entries(): IterableIterator<[A, B]>;
    /**
     * Returns an iterator that yields the entries of the TupleSet.
     * Each entry is a tuple containing two elements of types A and B.
     *
     * @returns {IterableIterator<[A, B]>} An iterator for the entries of the TupleSet.
     */
    [Symbol.iterator](): IterableIterator<[A, B]>;
    /**
     * Gets the total number of elements in the TupleSet.
     *
     * @returns {number} The total number of elements.
     */
    get size(): number;
}

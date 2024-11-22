export declare class TupleSet<A, B> {
    constructor(entries?: Array<[A, B]>);
    private _map;
    add(a: A, b: B): this;
    has(a: A, b: B): boolean;
    delete(a: A, b: B): this;
    clear(): this;
    entries(): IterableIterator<[A, B]>;
    [Symbol.iterator](): IterableIterator<[A, B]>;
    get size(): number;
}

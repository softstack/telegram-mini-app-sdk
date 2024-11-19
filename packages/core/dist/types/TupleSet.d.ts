export declare class TupleSet<A, B> {
    private _map;
    constructor(entries?: Array<[A, B]>);
    add(a: A, b: B): this;
    has(a: A, b: B): boolean;
    delete(a: A, b: B): this;
    clear(): this;
    entries(): IterableIterator<[A, B]>;
    [Symbol.iterator](): IterableIterator<[A, B]>;
    get size(): number;
}

export class CMemo<T extends object, V> {
    private readonly wm = new WeakMap<T, V>();

    private readonly fn: (t: T) => V;

    public constructor(fn: (t: T) => V) {
        this.fn = fn;
    }

    public up(t: T): V {
        const cache: V | undefined = this.wm.get(t);
        if (cache !== undefined) return cache;

        const v: V = this.fn(t);
        this.wm.set(t, v);
        return v;
    }
}

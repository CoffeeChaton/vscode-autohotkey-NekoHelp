export function arrDeepEQ(a: string[] | readonly string[], b: string[] | readonly string[]): boolean {
    if (Array.length !== b.length) return false;

    const { length } = a;
    for (let i = 0; i < length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

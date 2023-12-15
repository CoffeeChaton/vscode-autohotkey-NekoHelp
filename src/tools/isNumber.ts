export function isLookLikeNumber(str: string): boolean {
    return (/^0x[A-F\d]+$/iu).test(str)
        || (/^\d+$/u).test(str) // int
        || (/^\d*\.\d+$/u).test(str) // float
        || (/^\d*\.\d+e[+-]?\d+$/iu).test(str); // -2.1E-4 , 1.0e4 , all need `.`
}

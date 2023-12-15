export function isString(str: string): boolean {
    return (/^\^+$/u).test(str);
}

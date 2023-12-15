export function isBuiltin(str: string): boolean {
    return (/^False|True$/iu).test(str);
}

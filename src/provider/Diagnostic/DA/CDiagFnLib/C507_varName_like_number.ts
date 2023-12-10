export function C507_varName_like_number(varName: string): boolean {
    return (/^0X[\dA-F]+$/iu).test(varName) || (/^\d+$/u).test(varName);
}

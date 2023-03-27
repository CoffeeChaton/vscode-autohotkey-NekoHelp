/**
 * convertAsciiToUppercase
 * <https://www.autohotkey.com/docs/v1/Concepts.htm#names>
 * Case sensitivity
 * 1. None for ASCII characters. For example, CurrentDate is the same as currentdate.
 * 2. However, uppercase non - ASCII characters such as 'Ä' are not considered equal to their lowercase counterparts
 */
export function ToUpCase(str: string): string {
    if ((/^[#$@\w]+$/iu).test(str)) { // just ascii range
        return str.toUpperCase();
    }
    return str.replaceAll(/[a-z]/u, (substring: string): string => substring.toUpperCase());
}

/**
 * - A0: "{"
 * - A1 : "["
 * - A2: "("
 */
export type TBrackets = [number, number, number];

type TMap = ReadonlyMap<string, readonly [0 | 1 | 2, -1 | 1]>;

const BracketMap: TMap = new Map([
    ['{', [0, +1]],
    ['}', [0, -1]],
    ['[', [1, +1]],
    [']', [1, -1]],
    ['(', [2, +1]],
    [')', [2, -1]],
]);

/**
 * - A0: "{"
 * - A1 : "["
 * - A2: "("
 */
export function calcBracket(partStr: string, list: TBrackets): TBrackets {
    const newBrackets: TBrackets = [...list];

    for (const str of partStr) {
        const config = BracketMap.get(str);
        if (config !== undefined) {
            newBrackets[config[0]] += config[1];
        }
    }

    return newBrackets;
}

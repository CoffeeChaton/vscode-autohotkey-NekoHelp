import type { TTokenStream } from '../../../globalEnum';
import type { TRefBuiltInFn } from './allCmd2type';

export function BuiltInFn2StrList(DocStrMap: TTokenStream, refBuiltInFn: Readonly<TRefBuiltInFn>): string[] {
    // fnName := "
    // ( LTrm C
    // ln xx ; textRaw
    // )"
    const arr: string[] = [];

    for (const [_k, [refList, { keyRawName, uri }]] of refBuiltInFn) {
        arr.push(
            `${keyRawName} :="`,
            '( LTrim C',
            `${keyRawName}() ; ${uri}`,
            '[ln, col]',
        );
        for (const { line, col } of refList) {
            const { textRaw } = DocStrMap[line];
            arr.push(`[${line + 1}, ${col + 1}] ; ${textRaw.trim()}`);
        }
        arr.push(')"');
    }
    return arr;
}

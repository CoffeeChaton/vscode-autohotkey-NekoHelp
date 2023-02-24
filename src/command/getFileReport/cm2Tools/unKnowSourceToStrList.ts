import type { TTokenStream } from '../../../globalEnum';
import type { TRefUnknown } from './allCmd2type';

export function unKnowSourceToStrList(DocStrMap: TTokenStream, refUnknown: Readonly<TRefUnknown>): string[] {
    // fnName := "
    // ( LTrm C
    // ln xx ; textRaw
    // )"
    const arr: string[] = [];

    for (const [k, refList] of refUnknown) {
        arr.push(`${k} :="`, '( LTrim C');
        for (const { line, col } of refList) {
            const { textRaw } = DocStrMap[line];
            arr.push(`[ln ${line + 1}, col ${col + 1}] ; ${textRaw.trim()}`);
        }
        arr.push(')"');
    }
    return arr;
}

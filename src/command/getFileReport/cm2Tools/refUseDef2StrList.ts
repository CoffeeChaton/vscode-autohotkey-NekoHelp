import type { TTokenStream } from '../../../globalEnum';
import type { TRefUseDef } from './allCmd2type';

export function refUseDef2StrList(DocStrMap: TTokenStream, refUseDef: Readonly<TRefUseDef>): string[] {
    // fnName := "
    // ( LTrm C
    // ln xx ; textRaw
    // )"

    const arr: string[] = [];

    for (const [_k, [refList, { name, uri, range }]] of refUseDef) {
        const { fsPath } = uri;
        const msg: string[] = [
            `${name} :="`,
            '( LTrim C',
            `${name}() ; ${fsPath} [${range.start.line + 1}, ${range.start.character + 1}]`,
            '[ln, col]',
        ];
        for (const { line, col } of refList) {
            const { textRaw } = DocStrMap[line];
            msg.push(`[${line + 1}, ${col + 1}] ; ${textRaw.trim()}`);
        }
        msg.push(')"');
        //
        arr.push(...msg);
    }

    return arr;
}

import type { TTokenStream } from '../../../globalEnum';
import type { TRefJustBy2 } from './allCmd2type';

export function mayUseByStr(DocStrMap: TTokenStream, refJustBy2: Readonly<TRefJustBy2>): string[] {
    // fnName := "
    // ( LTrm C
    // ln xx ; textRaw
    // )"

    const arr: string[] = [
        '; exp --------------------------------',
        ';#NoEnv',
        ';#Warn All',
        ';SetControlDelay, 0',
        ';',
        ';~F9:: fn_exp(["fnA","fnB"])',
        ';~F10:: fn_exp(["fnB","fnA"])',
        ';',
        ';fn_exp(fnList){',
        ';    For _Key, fn in fnList {',
        ';        funcOnj := Func(fn)',
        ';        funcOnj.Call()',
        ';    }',
        ';}',
        ';',
        ';fnA(){',
        ';    MsgBox, % "i am fnA"',
        ';}',
        ';',
        ';fnB(){',
        ';    MsgBox, % "i am fnB"',
        ';}',
        '; exp end----------------------------------',
        '',
    ];

    for (const [_k, [refList, { name, uri, range }]] of refJustBy2) {
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

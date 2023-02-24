import type { TTokenStream } from '../../globalEnum';

type TMsg = {
    textRaw: string,
    line: number,
};

export function AnalyzeGlobalVal(AhkTokenList: TTokenStream): string[] {
    const MsgList: TMsg[] = [];
    for (const { fistWordUp, textRaw, line } of AhkTokenList) {
        if (fistWordUp === 'GLOBAL') {
            MsgList.push({ textRaw, line });
        }
    }
    if (MsgList.length === 0) return [];
    const ed: string[] = [
        '/**',
        '* @Analyze Global Val',
        '* > read more of [Local and Global Variables](https://www.autohotkey.com/docs/v1/Functions.htm#Locals)',
        '* > [LocalSameAsGlobal](https://www.autohotkey.com/docs/v1/lib/_Warn.htm)',
        '* @suggest use [#Warn All, OutputDebug](https://www.autohotkey.com/docs/v1/lib/_Warn.htm)',
        '*/',
        'loop, 0 {',
    ];

    for (const Msg of MsgList) {
        ed.push(
            `${Msg.textRaw.trim()} ; ln ${Msg.line + 1}`,
        );
    }

    // ed.pop();
    ed.push('}', '');
    return ed;
}

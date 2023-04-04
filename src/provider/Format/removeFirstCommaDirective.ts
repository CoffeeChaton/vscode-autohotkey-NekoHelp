import type { TAhkTokenLine } from '../../globalEnum';
import type { TFmtCore } from './FormatType';
import { ToFmtCore } from './ToFmtCore';

export function removeFirstCommaDirective(
    {
        indentBlank,
        textRawTrimStart,
        ma1,
        AhkTokenLine,
    }: { indentBlank: string, textRawTrimStart: string, ma1: string, AhkTokenLine: TAhkTokenLine },
): TFmtCore {
    const { line, textRaw } = AhkTokenLine;

    const body: string = textRawTrimStart.replace(/^\s*#\w+[ \t]*,[ \t]*/u, '');
    const newText = `${indentBlank}#${ma1} ${body}`;

    return ToFmtCore({ line, textRaw, newText });
}

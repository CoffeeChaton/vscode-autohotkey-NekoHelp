import type { TAhkTokenLine } from '../../globalEnum';
import type { TFmtCore } from './FormatType';

export function removeFirstCommaDirective(text: string, ma1: string, AhkTokenLine: TAhkTokenLine): TFmtCore {
    const { line, textRaw } = AhkTokenLine;

    const index: number = text.indexOf('#');
    const indentBlank: string = text.slice(0, index);
    const body: string = text.replace(/^\s*#\w+[ \t]*,[ \t]*/u, '');
    const newText = `${indentBlank}#${ma1} ${body}`;
    return {
        line,
        oldText: textRaw,
        newText,
        hasOperatorFormat: newText !== text,
    };
}

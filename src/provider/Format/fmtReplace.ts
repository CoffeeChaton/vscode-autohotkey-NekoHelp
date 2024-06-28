import type { TAhkTokenLine } from '../../globalEnum';
import { EDetail, EMultiline } from '../../globalEnum';
import { Cmd_MDMap } from '../../tools/Built-in/6_command/Command.tools';
import { lineReplaceCheckIfIn } from './tools/lineReplaceCheckIfIn';

function textReplace(textElement: string): string {
    return textElement.replaceAll(/ *, */gu, ', ')
        .replaceAll(/ *:= */gu, ' := ')
        .replaceAll(/ *!= *(?!=)/gu, ' != ')
        .replaceAll(/ *!== */gu, ' !== ')
        // .replaceAll(/ *== */g, ' == ') test err
        // .replaceAll(/ *>= */g, ' >= ') test err
        // .replaceAll(/ *<= */g, ' <= ') test err
        .replaceAll(/ *\.= */gu, ' .= ')
        .replaceAll(/ *\+= */gu, ' += ')
        .replaceAll(/ *-= */gu, ' -= ')
        .replaceAll(/ *\|\| */gu, ' || ')
        .replaceAll(/ *&& */gu, ' && ')
        .replaceAll(/ *<> */gu, ' <> ')
        .replaceAll(/\breturn\s+/giu, (m: string): string => `${m.trim()} `)
        // .replaceAll(/ *\? */g, ' ? ')
        .replaceAll(/\( */gu, '(')
        .replaceAll(/ *\)/gu, ')')
        .replaceAll(/\[ */gu, '[')
        .replaceAll(/ *\]/gu, ']')
        // .replaceAll(/ *\{ */ug, ' {')
        // .replaceAll(/ *\}/ug, '}')
        // .replaceAll(/\}\s+/ug, '} ')
        .replaceAll(/\)\s*\{ */gu, ') {')
        .replaceAll(/\bif\s*(?=\()/giu, (m: string): string => `${m.trim()} `)
        .replaceAll(/\bwhile\s*(?=\()/giu, (m: string): string => `${m.trim()} `)
        .replaceAll(/\belse\s*(?=\{)/giu, (m: string): string => `${m.trim()} `)
        .replaceAll(/(?<=\})\s*else\b/giu, (m: string): string => ` ${m.trim()}`)
        .replaceAll(/(?:^|\s+)until\s+/giu, (m: string): string => ` ${m.trim()} `)
        .replaceAll(/ *;/gu, ' ;');

    // \s === [ \f\n\r\t\v]
    // need more TEST & options
}

function fnLR(strElement: string): string {
    const LR = strElement.indexOf(';');
    if (LR === -1) return textReplace(strElement);
    if (LR === 0) return strElement;
    if (LR > 0) {
        const Left = strElement.slice(0, LR + 1);
        const Right = strElement.slice(LR + 1, strElement.length); // || '';
        return textReplace(Left) + Right;
    }
    return strElement;
}

function fnStrGroup(text: string): string {
    const headInt = text.search(/\S/u);

    const head = (headInt > 0)
        ? text.slice(0, headInt)
        : '';

    const body = (headInt >= 0)
        ? text.slice(headInt)
        : text;

    const strGroup = body.split('"');
    const sMax = strGroup.length;
    let newBody = '';
    for (let s = 0; s < sMax; s++) {
        newBody += (s > 0 && s < sMax)
            ? '"'
            : '';

        const strElement = strGroup[s];
        newBody += ((s % 2) !== 0 || strElement.includes('`'))
            ? strElement
            : fnLR(strElement);
    }
    return head + newBody.trimStart();
}

export function lineReplace(AhkTokenLine: TAhkTokenLine, text: string, lStrTrim: string): string {
    const {
        detail,
        multiline,
        fistWordUp,
        SecondWordUp,
    } = AhkTokenLine;

    return (lStrTrim === ''
            || (lStrTrim.startsWith('#') && !(/^#if[ \t]/iu).test(lStrTrim)) // Avoid formatting to other unknown #directives
            || detail.includes(EDetail.inSkipSign2)
            || detail.includes(EDetail.inComment)
            || multiline !== EMultiline.none
            || detail.includes(EDetail.isHotKeyLine)
            || detail.includes(EDetail.isHotStrLine)
            || Cmd_MDMap.has(fistWordUp)
            || Cmd_MDMap.has(SecondWordUp)
            || lineReplaceCheckIfIn(AhkTokenLine) !== null)
        ? text
        : fnStrGroup(text);
}
// Text Replace Alpha test options

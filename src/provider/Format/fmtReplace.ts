import type { TAhkTokenLine } from '../../globalEnum';
import { EDetail, EMultiline } from '../../globalEnum';
import { CommandMDMap } from '../../tools/Built-in/Command.tools';

function textReplace(textElement: string): string {
    return textElement.replaceAll(/ *, */gu, ', ')
        .replaceAll(/ *:= */gu, ' := ')
        .replaceAll(/ *!= */gu, ' != ')
        // .replaceAll(/ *== */g, ' == ') test err
        // .replaceAll(/ *>= */g, ' >= ') test err
        // .replaceAll(/ *<= */g, ' <= ') test err
        .replaceAll(/ *\.= */gu, ' .= ')
        .replaceAll(/ *\+= */gu, ' += ')
        .replaceAll(/ *-= */gu, ' -= ')
        .replaceAll(/ *\|\| */gu, ' || ')
        .replaceAll(/ *&& */gu, ' && ')
        .replaceAll(/ *<> */gu, ' <> ')
        .replaceAll(/\breturn\s+/gu, 'return ')
        .replaceAll(/\bReturn\s+/gu, 'Return ')
        // .replaceAll(/ *\? */g, ' ? ')
        .replaceAll(/\( */gu, '(')
        .replaceAll(/ *\)/gu, ')')
        .replaceAll(/\[ */gu, '[')
        .replaceAll(/ *\]/gu, ']')
        // .replaceAll(/ *\{ */ug, ' {')
        // .replaceAll(/ *\}/ug, '}')
        // .replaceAll(/\}\s+/ug, '} ')
        .replaceAll(/\)\s*\{ */gu, ') {')
        .replaceAll(/\bif\s*\(/gu, 'if (')
        .replaceAll(/\bIf\s*\(/gu, 'If (')
        .replaceAll(/\bIF\s*\(/gu, 'IF (')
        .replaceAll(/\bwhile\s*\(/gu, 'while (')
        .replaceAll(/\bWhile\s*\(/gu, 'While (')
        .replaceAll(/\bWHILE\s*\(/gu, 'WHILE (')
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
    } = AhkTokenLine;

    return (lStrTrim === ''
            || detail.includes(EDetail.inSkipSign2)
            || detail.includes(EDetail.inComment)
            || multiline !== EMultiline.none
            || detail.includes(EDetail.isHotKeyLine)
            || detail.includes(EDetail.isHotStrLine)
            || CommandMDMap.has(fistWordUp))
        ? text
        : fnStrGroup(text);
}

import * as vscode from 'vscode';
import { EMode } from '../../Enum/EMode';
import type { TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';

function getReturnText(lStr: string, textRaw: string, col: number): string {
    const name: string = textRaw
        // eslint-disable-next-line no-magic-numbers
        .slice(col + 6) // "Return".len
        .replace(/^[\s,]+/u, '')
        .trim();

    if (name === '') return '    Return';

    const comment: string = textRaw.length > lStr.length
        ? textRaw.slice(lStr.length)
        : '';

    // func
    const Func: RegExpMatchArray | null = name.match(/^(\w+)\(/u);
    if (Func !== null) {
        return `    Return ${Func[1]}(...) ${comment}`;
    }

    // obj
    if (name.includes('{') && name.includes(':')) {
        const returnObj: RegExpMatchArray | null = name.match(/^(\{\s*\w+\s*:\s*\S{0,20})/u);
        if (returnObj !== null) {
            return `    Return ${returnObj[1].trim()} ${comment}`;
        }
    }

    // ------------be careful of comment----------

    // too long
    const maxLen = 30;
    if (name.length > maxLen) {
        return `    Return ${name.slice(0, maxLen).replace(/\s;.*/u, '')} ... ${comment}`;
    }
    // else
    return `    Return ${name.trim()}`;
}

export function getFuncDocCore(
    {
        fileName,
        AhkTokenList,
        ahkDoc,
        selectionRangeText,
        classStack,
    }: {
        fileName: string,
        AhkTokenList: TTokenStream,
        ahkDoc: string,
        selectionRangeText: string,
        classStack: string[],
    },
): vscode.MarkdownString {
    const returnList: string[] = [];

    for (const AhkTokenLine of AhkTokenList) {
        const {
            detail,
            textRaw,
            lStr,
            fistWordUp,
            fistWordUpCol,
            SecondWordUp,
            SecondWordUpCol,
        } = AhkTokenLine;

        if (detail.includes(EDetail.inComment)) {
            continue;
        }

        if (fistWordUp === 'RETURN') {
            returnList.push(getReturnText(lStr, textRaw, fistWordUpCol));
        } else if (SecondWordUp === 'RETURN') {
            returnList.push(getReturnText(lStr, textRaw, SecondWordUpCol));
            // eslint-disable-next-line no-magic-numbers
        } else if (lStr.length > 8) { // "Return A".len
            const col: number = lStr.search(/\bReturn\b/iu);
            if (col !== -1) {
                returnList.push(getReturnText(lStr, textRaw, col));
            }
        }
    }

    //
    const kindStr: string = classStack.length === 0
        ? EMode.ahkFunc
        : EMode.ahkMethod;

    const classStackStr: string = classStack.length === 0
        ? ''
        : `class ${classStack.join('.')}\n\n`;

    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown(`(${kindStr})     of     ${fileName}\n`)
        .appendMarkdown(classStackStr)
        .appendCodeblock(`${selectionRangeText}{`, 'ahk')
        .appendCodeblock(returnList.filter((s: string): boolean => s !== '').join('\n'), 'ahk')
        .appendCodeblock('}', 'ahk');

    if (ahkDoc !== '') {
        md.appendMarkdown('\n\n***\n\n')
            .appendMarkdown(ahkDoc); // **** MD ****** sensitive of \s && \n
    }

    md.supportHtml = true;

    return md;
}

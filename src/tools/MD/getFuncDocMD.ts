/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import type { TFnMeta, TFnParamMeta, TFnReturnMeta } from '../../AhkSymbol/CAhkFunc';
import { getCustomize } from '../../configUI';
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
    const Func: RegExpMatchArray | null = name.match(/^([#$@\w\u{A1}-\u{FFFF}]+)\(/u);
    if (Func !== null) {
        return `    Return ${Func[1]}(...) ${comment}`;
    }

    // obj
    if (name.includes('{') && name.includes(':')) {
        const returnObj: RegExpMatchArray | null = name.match(/^(\{[ \t]*[#$@\w\u{A1}-\u{FFFF}]+[ \t]*:\s*\S{0,20})/u);
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

function parseAhkDoc(ahkDoc: string): TFnMeta['ahkDocMeta'] {
    // parse
    // @param {type}? param_name information
    // @returns {type} information
    const paramMeta: TFnParamMeta[] = [];
    const otherMeta: string[] = [];
    const returnMeta: TFnReturnMeta = {
        typeDef: '',
        info: [],
    };

    const docList: string[] = ahkDoc.split(/\r?\n/u);
    const { length } = docList;
    for (let i = 0; i < length; i++) {
        const str: string = docList[i];

        if ((/^\s*@returns\s/iu).test(str)) {
            const st1: string = str.replace(/^\s*@returns\s+/iu, '');

            const typeDef: string = st1.startsWith('{')
                ? st1.slice(1, st1.indexOf('}')).trim()
                : '';
            const st2: string = st1.startsWith('{')
                ? st1.slice(st1.indexOf('}') + 1).trimStart()
                : st1.trimStart();

            returnMeta.typeDef = typeDef;
            returnMeta.info.push(st2);

            for (let j = i + 1; j < length; j++) {
                const str2: string = docList[j];
                if ((/^\s*@/u).test(str2)) break;
                i = j - 1;

                returnMeta.info.push(str2.slice(1));
            }
            continue;
        }
        if ((/^\s*@param\s/iu).test(str)) {
            const st1: string = str.replace(/^\s*@param\s+/iu, '');

            const ATypeDef: string = st1.startsWith('{')
                ? st1.slice(1, st1.indexOf('}')).trim()
                : '';
            const st2: string = st1.startsWith('{')
                ? st1.slice(st1.indexOf('}') + 1).trimStart()
                : st1.trimStart();
            // eslint-disable-next-line unicorn/no-hex-escape, regexp/no-invalid-regexp
            const BParamName: string = st2.slice(0, st2.search(/\s|$/u)).trim();

            const str3: string = st2.slice(BParamName.length).trimStart();
            const CInfo: string[] = [str3];
            paramMeta.push({
                ATypeDef,
                BParamName,
                CInfo,
            });
            for (let j = i + 1; j < length; j++) {
                const str2: string = docList[j];
                if ((/^\s*@/u).test(str2)) break;
                i = j - 1;

                CInfo.push(str2.slice(1));
            }
            continue;
        }

        otherMeta.push(str);
    }

    return {
        hasAhkDoc: true,
        paramMeta,
        returnMeta,
        otherMeta,
    };
}

export function getFuncMeta(
    AhkTokenList: TTokenStream,
    ahkDoc: string,
): TFnMeta {
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

    return ahkDoc === ''
        ? { // happy path
            ahkDocMeta: {
                hasAhkDoc: false,
                paramMeta: [],
                returnMeta: {
                    typeDef: '',
                    info: [],
                },
                otherMeta: [],
            },
            returnList,
        }
        : {
            ahkDocMeta: parseAhkDoc(ahkDoc),
            returnList,
        };
}

export function getFuncDocMake(
    {
        meta,
        defStack,
        fileName,
        selectionRangeText,
        ahkDoc,
    }: { meta: TFnMeta, defStack: readonly string[], fileName: string, selectionRangeText: string, ahkDoc: string },
): vscode.MarkdownString {
    const kindStr: string = defStack.length === 0
        ? EMode.ahkFunc
        : EMode.ahkMethod;

    const classStackStr: string = defStack.length === 0
        ? ''
        : `class ${defStack.join('.')}\n\n`;

    const { returnList, ahkDocMeta } = meta;
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown(`(${kindStr})     of     ${fileName}\n`)
        .appendMarkdown(classStackStr);

    const { HoverFuncShowReturnBlock } = getCustomize();
    const fnSign: string = HoverFuncShowReturnBlock === 'always'
            || (HoverFuncShowReturnBlock === 'auto' && ahkDocMeta.returnMeta.info.length === 0)
        ? `${selectionRangeText}${
            getCustomize().HoverFunctionDocStyle === 1
                ? ''
                : '\n'
        }{\n${
            returnList
                .join('\n')
        }\n}`
        : selectionRangeText;

    md.appendCodeblock(fnSign, 'ahk');

    if (ahkDoc !== '') {
        md.appendMarkdown('\n\n***\n\n')
            .appendMarkdown(ahkDoc); // **** MD ****** sensitive of \s && \n
    }

    md.supportHtml = true;

    return md;
}

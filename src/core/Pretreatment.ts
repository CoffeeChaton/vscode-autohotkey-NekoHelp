/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { TAhkTokenLine, TMultilineFlag, TTokenStream } from '../globalEnum';
import { EDetail, EMultiline } from '../globalEnum';
import { getIgnore } from '../provider/Diagnostic/getIgnore';
import { log } from '../provider/vscWindows/log';
import { getMultiline } from '../tools/str/getMultiline';
import { getMultilineLStr } from '../tools/str/getMultilineLStr';
import { docCommentBlock, EDocBlock, inCommentBlock } from '../tools/str/inCommentBlock';
import { getLStr } from '../tools/str/removeSpecialChar';
import { isSetVarTradition, SetVarTradition } from '../tools/str/traditionSetVar';
import { getFistWordUpData } from './getFistWordUpData';
import { getSecondUp } from './getSecondUp';
import { callDeep2 } from './ParserTools/calcDeep';
import { ContinueLongLine } from './ParserTools/ContinueLongLine';
import { getLStrHotStr } from './ParserTools/getLStrHotStr';

/**
 * Avoid too many messages
 */
let HintInfoChangeToAhk: 0 | 1 = 0;

function infoAddAhk2(document: vscode.TextDocument, ahkV0: string): 'isAhk2' {
    const { fsPath } = document.uri;

    if (HintInfoChangeToAhk === 0) {
        void vscode.languages.getLanguages().then((langs: string[]): null => {
            if (langs.includes('ahk2')) return null;

            // try {
            //     if (langs.includes('ahk2')) {
            //         await vscode.languages.setTextDocumentLanguage(document, 'ahk2');
            //         return null;
            //     }
            //     await vscode.languages.setTextDocumentLanguage(document, 'plaintext');
            // } catch (error: unknown) {
            //     let message = 'Unknown Error';
            //     if (error instanceof Error) {
            //         message = error.message;
            //     }
            //     if (message !== 'Unknown language id: ahk2') {
            //         OutputChannel.appendLine(';AhkNekoHelp.switchAhk2 Error Start------------');
            //         OutputChannel.appendLine(message);
            //         OutputChannel.appendLine(';AhkNekoHelp.switchAhk2 Error End--------------');
            //         OutputChannel.show();
            //     }
            // }

            const fileName: string = path.basename(fsPath);
            log.info(
                `some file like "${fileName}" is "${ahkV0.trim()}" ;NekoHelp not support ahk2, suggest to use other Extensions`,
            );

            HintInfoChangeToAhk = 1;

            return null;
        });
    }

    // throw new Error(`ahk2 -> ${textTrim} -> ${fsPath}`);
    return 'isAhk2';
}

function getRequiresVersion(textTrimStart: string): 0 | 1 | 2 {
    // #Requires AutoHotkey v2.0-a
    // #Requires AutoHotkey >=2.0- <2.1
    // #Requires AutoHotkey >2.0- <=2.1
    // #Requires AutoHotkey v2.0-rc.2 64-bit
    const Requires: RegExpMatchArray | null = textTrimStart
        .match(/^#Requires[ \t]+AutoHotkey\w*[ \t]+(.*)/iu);

    if (Requires !== null) {
        const ahkV: RegExpMatchArray | null = (Requires[1]).match(/[v>=][ \t]*(\d)\b/iu);
        if (ahkV !== null) {
            if (ahkV[1] === '1') return 1;
            if (ahkV[1] === '2') return 2;
        }
    }

    return 0; // as 'unknown';
}

/**
 * @param strArray keep this with readonly string[], don't use String, because of copy.
 *  and without str.spilt(\r?\n), I hate \r
 */
export function Pretreatment(
    strArray: readonly string[],
    document: vscode.TextDocument,
): TTokenStream | 'isAhk2' {
    let needCheckThisAhk2 = true;
    const result: TAhkTokenLine[] = [];
    let CommentBlock = false;
    let multiline: EMultiline = EMultiline.none;
    let multilineFlag: TMultilineFlag = null;
    let deep = 0;
    let line = -1;
    let ignoreLine = -1;
    let ignoreLineP = -1;

    let flag: EDocBlock = EDocBlock.other;
    const fnDocList: string[] = [];

    for (const textRaw of strArray) {
        line++;

        let ahkDoc = '';
        const textTrimStart: string = textRaw.trimStart();
        if (deep < 0) {
            deep = 0;
        }
        const temp = getIgnore({
            textTrimStart,
            line,
            ignoreLine,
            ignoreLineP,
        });
        ignoreLine = temp.ignoreLine;
        ignoreLineP = temp.ignoreLineP;
        const displayErr = line > ignoreLine;
        const displayFnErr = line > ignoreLineP;

        flag = docCommentBlock(textTrimStart, flag);
        if (
            flag === EDocBlock.inDocCommentBlockMid
            && (textTrimStart.startsWith('*') || textTrimStart.startsWith(';'))
        ) {
            // allow '*' and ';'
            const mdLineText = textTrimStart.slice(1);
            if ((/^\s*(?:@|-)/u).test(mdLineText)) {
                fnDocList.push(''); // add \n to-> fnDocList.join('\n');
            }
            fnDocList.push(mdLineText); // **** MD ****** sensitive of \s && \n
        }

        if (flag === EDocBlock.inDocCommentBlockEnd) {
            ahkDoc = fnDocList.join('\n');
            fnDocList.length = 0;
        }

        if (multiline === EMultiline.none) {
            CommentBlock = inCommentBlock(textTrimStart, CommentBlock);
            if (CommentBlock) {
                result.push({
                    ahkDoc,
                    cll: 1,
                    deep2: [deep],
                    detail: [EDetail.inComment],
                    displayErr,
                    displayFnErr,
                    fistWordUp: '',
                    fistWordUpCol: -1,
                    line,
                    lineComment: '',
                    lStr: '',
                    multiline,
                    multilineFlag: null,
                    SecondWordUp: '',
                    SecondWordUpCol: -1,
                    textRaw,
                });
                continue;
            }
        }

        if ((/^:[^:]*:[^:]+::/u).test(textTrimStart)) {
            /**
             * of hotStr
             *
             * (::
             * foo(){
             * MsgBox % "hotStr of ("
             * }
             */
            result.push({
                ahkDoc,
                cll: 0,
                deep2: [deep],
                detail: [EDetail.isHotStrLine],
                displayErr,
                displayFnErr,
                fistWordUp: '',
                fistWordUpCol: -1,
                line,
                lineComment: '',
                lStr: getLStrHotStr(textRaw),
                multiline,
                multilineFlag: null,
                SecondWordUp: '',
                SecondWordUpCol: -1,
                textRaw,
            });
            continue;
        }

        if (textTrimStart.includes('::')) {
            /**
             * of hotKey
             *
             * (::
             *     foo(){
             *         MsgBox % "hotStr of ("
             *     }
             */
            const lStrA: string = getLStr(textRaw);

            if (lStrA.includes('::')) {
                const lStr: string = lStrA.replace(/[^:]+::/u, '').padStart(lStrA.length, ' ');
                const { fistWordUpCol, fistWordUp } = getFistWordUpData({ lStrTrim: lStr.trim(), lStr, cll: 0 });
                const { SecondWordUpCol, SecondWordUp } = getSecondUp(lStr, fistWordUp, fistWordUpCol);

                result.push({
                    ahkDoc,
                    cll: 0,
                    deep2: [deep],
                    detail: [EDetail.isHotKeyLine],
                    displayErr,
                    displayFnErr,
                    fistWordUp,
                    fistWordUpCol,
                    line,
                    lineComment: '',
                    lStr,
                    multiline,
                    multilineFlag: null,
                    SecondWordUp,
                    SecondWordUpCol,
                    textRaw,
                });
                continue;
            }
        }

        [multiline, multilineFlag] = getMultiline({
            textTrimStart,
            multiline,
            multilineFlag,
            textRaw,
            result,
            line,
        });
        if (multiline === EMultiline.start || multiline === EMultiline.mid) {
            result.push({
                ahkDoc,
                cll: 1,
                deep2: [deep],
                detail: [],
                displayErr,
                displayFnErr,
                fistWordUp: '',
                fistWordUpCol: -1,
                line,
                lineComment: '',
                lStr: multiline === EMultiline.mid
                    ? getMultilineLStr({ multilineFlag, textRaw })
                    : '',
                multiline,
                multilineFlag,
                SecondWordUp: '',
                SecondWordUpCol: -1,
                textRaw,
            });
            continue;
        }

        if (textTrimStart.startsWith(';')) {
            result.push({
                ahkDoc,
                cll: 1,
                deep2: [deep],
                detail: textTrimStart.startsWith(';;')
                    ? [EDetail.inComment, EDetail.hasDoubleSemicolon]
                    : [EDetail.inComment],
                displayErr,
                displayFnErr,
                fistWordUp: '',
                fistWordUpCol: -1,
                line,
                lineComment: textTrimStart.replace(/^;\s*/u, ''),
                lStr: '',
                multiline,
                multilineFlag: null,
                SecondWordUp: '',
                SecondWordUpCol: -1,
                textRaw,
            });

            continue;
        }

        if (isSetVarTradition(textTrimStart)) {
            result.push({
                ahkDoc,
                cll: 0,
                deep2: [deep],
                detail: [EDetail.inSkipSign2],
                displayErr,
                displayFnErr,
                fistWordUp: '',
                fistWordUpCol: -1,
                line,
                lineComment: '',
                lStr: SetVarTradition(textRaw),
                multiline,
                multilineFlag: null,
                SecondWordUp: '',
                SecondWordUpCol: -1,
                textRaw,
            });
            continue;
        }

        if (needCheckThisAhk2) {
            const version: 0 | 1 | 2 = getRequiresVersion(textTrimStart);

            if (version === 2) return infoAddAhk2(document, textTrimStart);
            if (version === 1) needCheckThisAhk2 = false;
        }

        // ---------
        const lStr: string = multiline === EMultiline.end
            ? getLStr(textRaw.replace(/^[ \t]*\)"?/u, '').padStart(textRaw.length, ' '))
            : getLStr(textRaw);
        const lStrTrim: string = lStr.trim();
        const detail: EDetail[] = [];
        const lineComment: string = textRaw.length - lStr.length > 2
            ? textRaw.slice(lStr.length + 1).trim()
            : '';

        if (lineComment.startsWith(';')) {
            detail.push(EDetail.hasDoubleSemicolon);
        }

        if (lStrTrim === '') {
            result.push({
                ahkDoc,
                cll: 0,
                deep2: [deep],
                detail,
                displayErr,
                displayFnErr,
                fistWordUp: '',
                fistWordUpCol: -1,
                line,
                lineComment,
                lStr: '',
                multiline,
                multilineFlag: null,
                SecondWordUp: '',
                SecondWordUpCol: -1,
                textRaw,
            });
            continue;
        }

        if ((/^\w+:$/u).test(lStrTrim)) {
            // of hotKey
            result.push({
                ahkDoc,
                cll: 0,
                deep2: [deep],
                detail: [...detail, EDetail.isLabelLine],
                displayErr,
                displayFnErr,
                fistWordUp: '',
                fistWordUpCol: -1,
                line,
                lineComment,
                lStr,
                multiline,
                multilineFlag: null,
                SecondWordUp: '',
                SecondWordUpCol: -1,
                textRaw,
            });
            continue;
        }

        /**
         * // deep2
         */
        let deep2: number[] = [deep];
        if (!lStrTrim.includes('::')) {
            // {$                     || ^{
            if (lStrTrim.endsWith('{') || lStrTrim.startsWith('{')) {
                detail.push(EDetail.deepAdd);
            }

            /**
             *  // case of this ....
             *
             * WM_COMMAND(wParam, lParam)
             * {
             *    static view := {
             *    (Join,
             *        65406: "Lines"
             *        65407: "Variables"
             *        65408: "Hotkeys"
             *        65409: "KeyHistory"
             *    )}
             * ;  ^ -----------------------------------------here this ...case
             *    if (wParam = 65410) ; Refresh
             *        return Refresh()
             *    if view[wParam]
             *        return SetView(view[wParam])
             * }
             */
            const lStrTrimFix: string = multiline === EMultiline.end
                ? lStrTrim.replace(/^\)\s*/u, '')
                : lStrTrim;

            // ^}
            if (lStrTrimFix.startsWith('}')) {
                detail.push(EDetail.deepSubtract);
            }
            deep2 = callDeep2(lStrTrimFix, deep);
            // eslint-disable-next-line unicorn/prefer-at
            deep = deep2[deep2.length - 1];
            // deep++;

            // // {{{{
            // const addDeep: number = callDeep(lStrTrim, '{');
            // if (addDeep > 1) {
            //     deep--;
            //     deep += addDeep;
            // }

            // deep--;

            // // eslint-disable-next-line no-tabs
            // // }   } else RunWait "%AhkPath%" %AhkSw% "%wk%",,Hide

            // const diffDeep: number = callDeep(lStrTrimFix, '}');
            // if (diffDeep > 1) {
            //     deep++;
            //     deep -= diffDeep;
            // }
        }

        const cll: 0 | 1 = ContinueLongLine(lStrTrim); // ex: line start with ","

        const { fistWordUpCol, fistWordUp } = getFistWordUpData({ lStrTrim, lStr, cll });
        const { SecondWordUpCol, SecondWordUp } = getSecondUp(lStr, fistWordUp, fistWordUpCol);

        result.push({
            ahkDoc,
            cll,
            deep2,
            detail,
            displayErr,
            displayFnErr,
            fistWordUp,
            fistWordUpCol,
            line,
            lineComment,
            lStr,
            multiline,
            multilineFlag: null,
            SecondWordUp,
            SecondWordUpCol,
            textRaw,
        });
    }

    return result;
}

// LexicalAnalysisSimple

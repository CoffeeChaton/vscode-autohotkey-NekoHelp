import type {
    DeepWriteable,
    TAhkTokenLine,
    TMultilineFlag,
    TPos,
} from '../../globalEnum';
import { EDetail, EMultiline } from '../../globalEnum';
import { replacerSpace } from './removeSpecialChar';

type TGetMultilineFlag = {
    textRaw: string,
    result: readonly TAhkTokenLine[],
    line: number,
};

function getMultilineFlag({ textRaw, result, line }: TGetMultilineFlag): TMultilineFlag {
    const arr: readonly string[] = textRaw
        .replace(/^\s*\(\s*/u, replacerSpace)
        .split(' ')
        .filter((str: string): boolean => str.trim().length > 0);

    const flag: DeepWriteable<TMultilineFlag> = {
        Join: [],
        LTrim: [],
        RTrim0: [],
        CommentFlag: [],
        PercentFlag: [],
        commaFlag: [],
        accentFlag: [],
        unknownFlag: [], // ... need for of
        L: textRaw.indexOf('('),
        R: textRaw.length,
        isExpress: false,
    };
    let oldPos: number = textRaw.indexOf('(');

    for (const str of arr) {
        const col: number = textRaw.indexOf(str, oldPos);
        oldPos = col + str.length;
        const pos: TPos = {
            col,
            len: str.length,
        };
        //
        if ((/^Join.*$/iu).test(str)) {
            flag.Join.push(pos);
        } else if ((/^LTrim$/iu).test(str)) {
            flag.LTrim.push(pos);
        } else if ((/^RTrim0$/iu).test(str)) {
            flag.RTrim0.push(pos);
        } else if ((/^(?:Comments|Comment|Com|C)$/iu).test(str)) {
            flag.CommentFlag.push(pos);
        } else if (str.startsWith(';')) {
            flag.R = col;
            break; // -----break-------is line Comments
        } else {
            switch (str) {
                case '%':
                    flag.PercentFlag.push(pos);
                    break;

                case ',':
                    flag.commaFlag.push(pos);
                    break;

                case '`':
                    flag.accentFlag.push(pos);
                    break;

                default:
                    flag.unknownFlag.push(pos);
            }
        }
    }

    const lineBeforeMsg = result[line - 1] as TAhkTokenLine | undefined;
    if (lineBeforeMsg === undefined) return flag;
    //
    if (lineBeforeMsg.detail.includes(EDetail.inSkipSign2)) {
        return flag; // not Express
    }

    const textRawBefore: string = lineBeforeMsg.textRaw;
    for (let i = lineBeforeMsg.lStr.length - 1; i > -1; i--) {
        const s = textRawBefore[i];
        if (s === ' ' || s === '\t') continue;
        if (s === '"') {
            flag.isExpress = true;
            return flag;
        }
        if (s === ',') { // style3
            return flag; // false
        }
        break;
    }
    //  flag.isExpress = true;
    return flag;
}

type TGetMultiline = {
    textTrimStart: string,
    multiline: EMultiline,
    multilineFlag: TMultilineFlag,
    textRaw: string,
    result: readonly TAhkTokenLine[],
    line: number,
};

export function getMultiline(
    {
        textTrimStart,
        multiline,
        multilineFlag,
        textRaw,
        result,
        line,
    }: TGetMultiline,
): [EMultiline, TMultilineFlag] {
    if (multiline === EMultiline.none) {
        return textTrimStart.startsWith('(') /* && !textTrimStart.includes(')') */
            ? [EMultiline.start, getMultilineFlag({ textRaw, result, line })]
            : [EMultiline.none, null]; // 99%
    }

    if (multiline === EMultiline.start) {
        return textTrimStart.startsWith(')')
            ? [EMultiline.end, null]
            : [EMultiline.mid, multilineFlag];
    }

    if (multiline === EMultiline.mid) {
        return textTrimStart.startsWith(')')
            ? [EMultiline.end, null]
            : [EMultiline.mid, multilineFlag];
    }

    // END
    // if (LTrim === EMultiline.end)
    return textTrimStart.startsWith('(') && !textTrimStart.includes(')')
        ? [EMultiline.start, getMultilineFlag({ textRaw, result, line })] // look 0.1% case...
        : [EMultiline.none, null]; // 99%
}

// https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section

// 0.1% case, but can run....
// Var = ; <---------------------- not :=
//     ( LTrim join; ;ccc
//         1
//         2
//         3
//         4

//     )
//     ( LTrim

//         AA
//         BB
//     )
// ;...
// MsgBox, % Var
// ;show 1;2;3;4;\nAA\nBB

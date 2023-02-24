import type { TBrackets } from '../Bracket';
import { calcBracket } from '../Bracket';
import { getLStr } from './removeSpecialChar';

export function isSetVarTradition(textTrimStart: string): boolean {
    // Var = Value
    // https://www.autohotkey.com/docs/v1/Variables.htm#operators
    // is https://www.autohotkey.com/docs/v1/lib/SetEnv.htm
    const col0: number = textTrimStart.indexOf('=');

    if (col0 < 1) return false;
    if (textTrimStart[col0 + 1] === '=') return false; // ==

    switch (textTrimStart[col0 - 1]) {
        case ':': // :=
        case '<': // <=
        case '>': // >=
        case '~': // ~=
        case '+': // +=
        case '-': // -=
        case '*': // *=
        case '/': // /=
        case '.': // .=
        case '|': // |=
        case '&': // &=
        case '^': // ^=:
            return false;
        default:
            break;
    }
    const eqLeftStr: string = textTrimStart
        .slice(0, col0)
        // TODO .replace(/^[{} \t]*/u, '')
        .trim();

    /**
     * - A0: "{" -- skip now...
     * - A1 : "["
     * - A2: "("
     */
    const Brackets: TBrackets = calcBracket(eqLeftStr, [0, 0, 0]);
    if (/* Brackets[0] !== 0 || */ Brackets[1] !== 0 || Brackets[2] !== 0) {
        // FIXME /^\s{    a = 0
        // sc[A_Index=1?2160:2573](A_Index=1?Obj.Start:Obj.End,A_Index=1?Obj.End:Obj.Start),Num:=(Obj.End>Select.OPos&&Num<0)?A_Index-1:Num
        return false;
    }

    return (/^[%\w.[\]]+$/u).test(eqLeftStr);
}

export function SetVarTradition(textRaw: string): string {
    const col1 = textRaw.indexOf('=') + 1;
    const len = textRaw.length;

    const sate = {
        '%': false, // 0 or 1 or -> getLStr
        '`': false,
    };

    let lStr = textRaw.slice(0, col1);
    for (let i = col1; i < len; i++) {
        const s = textRaw[i];

        if (sate['`']) {
            // i need to check/diag  `[,%`;nrbtvaf] ?
            lStr += '_';
            sate['`'] = false;
            continue;
        }

        switch (s) {
            case ';': {
                const sBefore = textRaw[i - 1];
                if (sBefore === ' ' || sBefore === '\t') {
                    return lStr;
                }
                lStr += s;
                break;
            }

            case '`':
                lStr += '_';
                sate['`'] = true;
                break;

            case ' ':
            case '\t':
                lStr += s;
                break;

            case '%': {
                if (sate['%']) {
                    lStr += ' ';
                    sate['%'] = false;
                    continue;
                }
                const sNext: string | undefined = textRaw[i + 1] as string | undefined;
                if (sNext !== undefined && (sNext === ' ' || sNext === '\t')) {
                    // TODO edge case, i think need diag ...
                    lStr += ` ${sNext}${getLStr(textRaw.slice(i + 2, len))}`;
                    return lStr; // <---------------------------------------------------------------------------------------
                }
                lStr += ' ';
                sate['%'] = true;
                break;
            }

            default:
                lStr += sate['%']
                    ? s
                    : '_';
                break;
        }
    }

    return lStr;
}

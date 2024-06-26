import type { TAssociated, TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import { Cmd_OutputBaseMap } from '../../../Built-in/6_command/Command.tools';
import { ToUpCase } from '../../../str/ToUpCase';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';
import { pseudoArray } from './pseudoArray/pseudoArray';
import { pseudoArrayPushDef } from './pseudoArray/pseudoArrayPushDef';

/**
 * OutputVar
 * [Other Functions](https://www.autohotkey.com/docs/v1/Functions.htm#Other_Functions)
 * - https://github.com/polyethene/AutoHotkey-Scripts/blob/master/Functions.ahk
 * Provides a callable function for each AutoHotkey command that has an OutputVar.
 */
export function OutputVarCommandBase(need: TGetFnDefNeed, keyWord: string, col: number): null {
    const len: number | undefined = Cmd_OutputBaseMap.get(keyWord);
    if (len === undefined) return null;
    //
    const {
        lStr,
        line,
        paramMap,
        GValMap,
        valMap,
        lineComment,
        fnMode,
    } = need;

    const strF: string = lStr
        .slice(col + len)
        .replace(/^\s*,?\s*/u, '')
        .padStart(lStr.length, ' ');

    const ma: RegExpMatchArray | null = strF
        .match(/^[ \t]*([#$@\w\u{A1}-\u{FFFF}]+)(?:[ \t,]|$)/u);
    if (ma === null) return null;

    const RawName: string = ma[1];

    const UpName: string = ToUpCase(RawName);
    if (paramMap.has(UpName) || GValMap.has(UpName)) return null;

    const Associated: TAssociated | null = pseudoArray(lStr, line, keyWord, col);
    const value: TValMetaIn = getValMeta({
        line,
        character: strF.indexOf(RawName),
        RawName,
        valMap,
        lineComment,
        fnMode,
        Associated,
    });
    valMap.set(UpName, value);

    if (Associated !== null) {
        pseudoArrayPushDef(need, Associated);
    }

    return null;
}

// FileGetTime, OutputVar
// FileGetTime OutputVar
//           ^ miss "," is OK ... Why?

import { Cmd_OutputPlusMap } from '../../../Built-in/6_command/Command.tools';
import { ToUpCase } from '../../../str/ToUpCase';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';
import type { TScanData } from './spiltCommandAll';
import { spiltCommandAll } from './spiltCommandAll';

function pickCommand(needArr: number[] | readonly number[], AllCut: TScanData[]): TScanData[] {
    const needPartScan: TScanData[] = [];

    for (const make of needArr) {
        const ScanData: TScanData | undefined = AllCut[make] as TScanData | undefined; // some arg is optional
        if (ScanData === undefined) break;

        if (!(/^[#$@\w\u{A1}-\u{FFFF}]+$/u).test(ScanData.RawNameNew)) continue; // TODO diag This, Output usually not have %
        needPartScan.push(ScanData);
    }

    return needPartScan;
}

export function OutputVarCommandPlus(need: TGetFnDefNeed, keyWord: string, col: number): null {
    const needArr: readonly number[] | undefined = Cmd_OutputPlusMap.get(keyWord);
    if (needArr === undefined) return null;

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
        .slice(col + keyWord.length)
        .replace(/^\s*,?/u, `${keyWord},`)
        .padStart(lStr.length, ' ');

    for (const { RawNameNew, lPos } of pickCommand(needArr, spiltCommandAll(strF))) {
        const UpName: string = ToUpCase(RawNameNew);
        if (paramMap.has(UpName) || GValMap.has(UpName)) continue;

        valMap.set(
            UpName,
            getValMeta({
                line,
                character: lPos,
                RawName: RawNameNew,
                valMap,
                lineComment,
                fnMode,
                Associated: null,
            }),
        );
    }

    return null;
}

// not plan to support
// GuiControl ,, ControlID , value https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Blank

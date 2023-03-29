import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import { ToUpCase } from '../../../str/ToUpCase';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';

// NumGet(OutputVar [, Offset := 0, Type := "UPtr"])
// VarSetCapacity(OutputVar)
// TV_GetText(OutputVar, ItemID)
// LV_GetText(OutputVar, RowNumber [, ColumnNumber])

export function varSetCapacityFunc({
    lStr,
    valMap,
    line,
    paramMap,
    GValMap,
    lStrTrimLen,
    lineComment,
    fnMode,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line no-magic-numbers
    if (lStrTrimLen < 8) return; // 'NumGet('.length

    if (!lStr.includes('(')) return;
    for (
        const v of lStr.matchAll(
            // eslint-disable-next-line security/detect-unsafe-regex
            /(?:VarSetCapacity|NumGet|[TL]V_GetText)\([ \t]*&?([#$@\w\u{A1}-\u{FFFF}]+)(?=[/%`)+\-*&!'",.:;<=>?[\\^\]{|}~ \t]|$)/giu,
            //                                                                                             ^ with out \(
        )
    ) {
        const ch: number | undefined = v.index;
        if (ch === undefined) continue;

        const RawName: string = v[1];
        const UpName: string = ToUpCase(RawName);
        if (paramMap.has(UpName) || GValMap.has(UpName)) continue;

        const character: number = ch + v[0].indexOf(RawName, v[0].indexOf('('));

        const value: TValMetaIn = getValMeta({
            line,
            character,
            RawName,
            valMap,
            lineComment,
            fnMode,
        });
        valMap.set(ToUpCase(RawName), value);
    }
}

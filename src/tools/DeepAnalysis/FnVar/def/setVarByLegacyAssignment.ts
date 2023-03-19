import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';

// ACT_ASSIGNEXPR
// := the walrus operator
export function setVarByLegacyAssignment({
    lStr,
    valMap,
    line,
    paramMap,
    GValMap,
    lineComment,
    fnMode,
}: TGetFnDefNeed): void {
    const strF: string = lStr;
    // .replace(/^[{} \t]*/u, '') // TODO: old legacyAssignment  diag/core is support `{`
    // .padStart(lStr.length);

    const v: RegExpMatchArray | null = strF.match(/^\s*(\w+)\s*=/u);
    if (v === null) return;

    const RawName: string = v[1];
    const character: number = strF.indexOf(RawName);

    const UpName: string = RawName.toUpperCase();
    if (paramMap.has(UpName) || GValMap.has(UpName)) return;

    const value: TValMetaIn = getValMeta({
        line,
        character,
        RawName,
        valMap,
        lineComment,
        fnMode,
    });
    valMap.set(UpName, value);
}

// Test OK     text := LT_bgColor_N := set_list := wait_time := Percentage := "Discard" ;clean

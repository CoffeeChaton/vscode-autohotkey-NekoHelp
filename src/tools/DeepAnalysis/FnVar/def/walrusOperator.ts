import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import { ToUpCase } from '../../../str/ToUpCase';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';

// ACT_ASSIGNEXPR
// := the walrus operator
export function walrusOperator({
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
    if (lStrTrimLen < 4) return; // A:= ----> len 3
    if (!lStr.includes(':=')) return; // TODO did i need to support .= += -= /= ?
    // :=
    // +=
    // -=
    // *=
    // /=
    // //=
    // .=
    // |=
    // &=
    // ^=
    // >>=
    // <<=
    // >>>=

    for (const v of lStr.matchAll(/(?<=[!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)([#$@\w\u{A1}-\u{FFFF}]+)[ \t]*:=/gu)) {
        //                                     // without .`% and #$@

        const RawName: string = v[1];
        const UpName: string = ToUpCase(RawName);
        if (paramMap.has(UpName) || GValMap.has(UpName)) continue;

        const value: TValMetaIn = getValMeta({
            line,
            character: v.index,
            RawName,
            valMap,
            lineComment,
            fnMode,
            Associated: null,
        });
        valMap.set(UpName, value);
    }
}

// Test OK     text := LT_bgColor_N := set_list := wait_time := Percentage := "Discard" ;clean

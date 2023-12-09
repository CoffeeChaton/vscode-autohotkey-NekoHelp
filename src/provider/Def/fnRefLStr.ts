import { EFnRefBy, type TAhkTokenLine, type TLineFnCall } from '../../globalEnum';
import { ToUpCase } from '../../tools/str/ToUpCase';

export function fnRefLStr(AhkTokenLine: TAhkTokenLine): readonly TLineFnCall[] {
    const { lineFnCallRaw, line } = AhkTokenLine;
    const arr: TLineFnCall[] = [];

    for (const { col, fnName } of lineFnCallRaw) {
        arr.push({
            by: EFnRefBy.justCall,
            col,
            line,
            upName: ToUpCase(fnName),
        });
    }

    return arr;
}

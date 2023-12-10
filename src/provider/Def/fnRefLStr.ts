import { EFnRefBy, type TAhkTokenLine, type TLineFnCall } from '../../globalEnum';
import { CMemo } from '../../tools/CMemo';
import { ToUpCase } from '../../tools/str/ToUpCase';

const memoFnRefLStr = new CMemo<TAhkTokenLine, readonly TLineFnCall[]>(
    (AhkTokenLine: TAhkTokenLine): readonly TLineFnCall[] => {
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
    },
);

export function fnRefLStr(AhkTokenLine: TAhkTokenLine): readonly TLineFnCall[] {
    return memoFnRefLStr.up(AhkTokenLine);
}

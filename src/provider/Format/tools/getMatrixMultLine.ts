/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,-999] }] */
import type { TMultilineFlag, TTokenStream } from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';
import { enumLog } from '../../../tools/enumErr';

function getDeepLTrim(Multiline: EMultiline, multilineFlag: TMultilineFlag): 0 | 1 {
    switch (Multiline) {
        case EMultiline.none:
            return 0;
        case EMultiline.start:
            return 1;
        case EMultiline.mid:
            if (multilineFlag === null) return 0;
            if (multilineFlag.LTrim.length === 0) return 0;
            return 1;
        case EMultiline.end:
            return 1;
        default:
            enumLog(Multiline, 'getDeepLTrim');
            return 0;
    }
}
/**
 * -9999 is mean not find of `(lTrim`
 */
export function getMatrixMultLine(DocStrMap: TTokenStream): readonly (-999 | 0 | 1)[] {
    //
    const list: (-999 | 0 | 1)[] = [];
    for (const AhkTokenLine of DocStrMap) {
        //
        const { multiline, multilineFlag } = AhkTokenLine;
        if (multilineFlag !== null && multilineFlag.LTrim.length === 0) {
            list.push(-999);
            continue;
        }
        if (multiline === EMultiline.end) {
            const last: -999 | 0 | 1 = list.at(-1) ?? 0;
            if (last === -999) {
                list.push(-999);
                continue;
            }
        }

        const lTrimDeep: 0 | 1 = getDeepLTrim(multiline, multilineFlag);
        list.push(lTrimDeep);
        //
    }
    return list;
}

/*
test code
----------------------------------------------------------------------------------------------------
    test1 := "
        ( LTrim ; has LTrim, this line deep === test2 line deep +1
            deep+1...
            deep+1...
            deep+1...
        )" ; this line deep === test2 line deep +1
----------------------------------------------------------------------------------------------------
    test2 := "
        (  ;not has LTrim, this line deep === test2 line deep +1
deepRaw...
    deepRaw...
            deepRaw...
deepRaw...
                            deepRaw...
                        deepRaw...
        )" ;this line deep === test2 line deep +1
----------------------------------------------------------------------------------------------------
*/

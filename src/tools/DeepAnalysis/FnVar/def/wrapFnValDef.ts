import type * as vscode from 'vscode';
import type { TAssociated, TValMapIn, TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import { ToUpCase } from '../../../str/ToUpCase';
import type { EFnMode } from '../EFnMode';
import { newC502 } from './c502';

type TGetValue = {
    RawNameNew: string,
    valMap: TValMapIn,
    defRange: vscode.Range,
    lineComment: string,
    fnMode: EFnMode,
    Associated: TAssociated | null,
};

export function wrapFnValDef({
    RawNameNew,
    valMap,
    defRange,
    lineComment,
    fnMode,
    Associated,
}: TGetValue): TValMetaIn {
    const oldVal: TValMetaIn | undefined = valMap.get(ToUpCase(RawNameNew));
    if (oldVal !== undefined) {
        oldVal.defRangeList.push({ range: defRange, c502: newC502(oldVal.keyRawName, RawNameNew) });
        if (lineComment.startsWith(';')) {
            oldVal.commentList.push(lineComment.slice(1));
        }
        if (Associated !== null) {
            oldVal.AssociatedList.push(Associated);
        }
        return oldVal;
    }

    return {
        keyRawName: RawNameNew,
        defRangeList: [{ range: defRange, c502: 0 }],
        refRangeList: [],
        commentList: [
            lineComment.startsWith(';')
                ? lineComment.slice(1)
                : '',
        ],
        fnMode,
        jsDocStyle: '', // default with ''
        AssociatedList: Associated === null
            ? []
            : [Associated],
    };
}

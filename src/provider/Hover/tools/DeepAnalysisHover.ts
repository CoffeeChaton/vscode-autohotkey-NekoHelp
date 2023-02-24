import type * as vscode from 'vscode';
import type {
    CAhkFunc,
    TParamMetaOut,
    TTextMetaOut,
    TValMetaOut,
} from '../../../AhkSymbol/CAhkFunc';
import { EPrefix, setMD } from '../../../tools/MD/setMD';
import { setPreFix } from '../../../tools/str/setPreFix';

function PosInRange(arr: readonly vscode.Range[], position: vscode.Position): boolean {
    return arr.some((range: vscode.Range): boolean => range.contains(position));
}

export function DeepAnalysisHover(
    DA: CAhkFunc,
    wordUp: string,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const {
        name,
        paramMap,
        valMap,
        textMap,
    } = DA;

    const argMeta: TParamMetaOut | undefined = paramMap.get(wordUp);
    if (argMeta !== undefined) {
        const {
            isByRef,
            isVariadic,
            refRangeList,
            defRangeList,
            commentList,
        } = argMeta;

        if (!PosInRange([...refRangeList, ...defRangeList], position)) return null;

        const prefix = setPreFix(isByRef, isVariadic);
        return setMD({
            prefix,
            refRangeList,
            defRangeList,
            funcName: name,
            recStr: '',
            commentList,
            jsDocStyle: '',
        });
    }

    const value: TValMetaOut | undefined = valMap.get(wordUp);
    if (value !== undefined) {
        const {
            refRangeList,
            defRangeList,
            commentList,
            jsDocStyle,
        } = value;
        if (!PosInRange([...refRangeList, ...defRangeList], position)) return null;

        return setMD({
            prefix: EPrefix.var,
            refRangeList,
            defRangeList,
            funcName: name,
            recStr: '',
            commentList,
            jsDocStyle,
        });
    }

    const textMeta: TTextMetaOut | undefined = textMap.get(wordUp);
    if (textMeta !== undefined) {
        const { refRangeList } = textMeta;
        if (!PosInRange(refRangeList, position)) return null;

        return setMD({
            prefix: EPrefix.unKnownText,
            refRangeList,
            defRangeList: [],
            funcName: name,
            recStr: '',
            commentList: [],
            jsDocStyle: '',
        });
    }

    return null;
}

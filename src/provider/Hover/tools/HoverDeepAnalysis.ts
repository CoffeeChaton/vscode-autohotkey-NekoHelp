/* eslint-disable max-lines-per-function */
import type * as vscode from 'vscode';
import type {
    CAhkFunc,
    TFnParamMeta,
    TParamMetaOut,
    TTextMetaOut,
    TValMetaIn,
    TValMetaOut,
} from '../../../AhkSymbol/CAhkFunc';
import { EPrefix, setMD } from '../../../tools/MD/setMD';
import { setPreFix } from '../../../tools/str/setPreFix';
import { ToUpCase } from '../../../tools/str/ToUpCase';

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
        meta,
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

        const prefix: EPrefix = setPreFix(isByRef, isVariadic);
        const paramMeta: TFnParamMeta | undefined = meta.ahkDocMeta.paramMeta
            .find((v): boolean => ToUpCase(v.BParamName) === wordUp);

        const jsDocStyle: string = paramMeta === undefined || paramMeta.CInfo.length === 0
            ? ''
            : `\`{${paramMeta.ATypeDef}}\` ${paramMeta.CInfo.join('\n')}`;

        return setMD({
            prefix,
            refRangeList,
            defRangeList,
            funcName: name,
            recStr: '',
            commentList,
            jsDocStyle,
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

    // #11 StringSplit https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/11
    if ((/\d+$/u).test(wordUp)) {
        //
        const chUpNameFa: string = wordUp.replace(/\d+$/u, '');
        const oldValStringSplit: TValMetaIn | undefined = valMap.get(chUpNameFa);
        if (oldValStringSplit !== undefined) {
            const {
                refRangeList,
                defRangeList,
                commentList,
                jsDocStyle,
            } = oldValStringSplit;
            for (const ref of refRangeList) {
                if (ref.contains(position)) {
                    return setMD({
                        prefix: EPrefix.var,
                        refRangeList: [],
                        defRangeList,
                        funcName: name,
                        recStr: '',
                        commentList,
                        jsDocStyle,
                    });
                }
            }
        }
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

import * as vscode from 'vscode';
import type {
    CAhkFunc,
    TFnParamMeta,
    TParamMapOut,
    TParamMetaOut,
} from '../../../../AhkSymbol/CAhkFunc';
import { setPreFix } from '../../../../tools/str/setPreFix';
import { ToUpCase } from '../../../../tools/str/ToUpCase';
import type { TSnippetRecMap } from '../ESnippetRecBecause';
import { setItemCore } from './setItem';

export function getParamCompletion(
    paramMap: TParamMapOut,
    funcName: string,
    recMap: TSnippetRecMap,
    kind: vscode.SymbolKind.Function | vscode.SymbolKind.Method,
    DA: CAhkFunc,
): vscode.CompletionItem[] {
    return [...paramMap.values()].map((v: TParamMetaOut): vscode.CompletionItem => {
        const {
            keyRawName,
            refRangeList,
            defRangeList,
            isByRef,
            isVariadic,
            commentList,
        } = v;

        const paramMeta: TFnParamMeta | undefined = DA.meta.ahkDocMeta.paramMeta
            .find((vv): boolean => ToUpCase(vv.BParamName) === ToUpCase(keyRawName));

        const jsDocStyle: string = paramMeta === undefined || paramMeta.CInfo.length === 0
            ? ''
            : `\`{${paramMeta.ATypeDef}}\` ${paramMeta.CInfo.join('\n')}`;

        return setItemCore({
            prefix: setPreFix(isByRef, isVariadic),
            recMap,
            keyRawName,
            funcName,
            refRangeList,
            defRangeList,
            snipKind: vscode.CompletionItemKind.Variable,
            kind,
            commentList,
            jsDocStyle,
        });
    });
}

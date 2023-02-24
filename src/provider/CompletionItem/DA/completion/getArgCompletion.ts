import * as vscode from 'vscode';
import type { TParamMapOut, TParamMetaOut } from '../../../../AhkSymbol/CAhkFunc';
import { setPreFix } from '../../../../tools/str/setPreFix';
import type { TSnippetRecMap } from '../ESnippetRecBecause';
import { setItemCore } from './setItem';

export function getParamCompletion(
    paramMap: TParamMapOut,
    funcName: string,
    recMap: TSnippetRecMap,
    kind: vscode.SymbolKind.Function | vscode.SymbolKind.Method,
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
            jsDocStyle: '',
        });
    });
}

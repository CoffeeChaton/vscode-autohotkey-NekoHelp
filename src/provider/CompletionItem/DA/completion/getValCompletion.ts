import * as vscode from 'vscode';
import type { TValMapOut, TValMetaOut } from '../../../../AhkSymbol/CAhkFunc';
import { EPrefix } from '../../../../tools/MD/setMD';
import type { TSnippetRecMap } from '../ESnippetRecBecause';
import { setItemCore } from './setItem';

export function getValCompletion(
    valMap: TValMapOut,
    funcName: string,
    recMap: TSnippetRecMap,
    kind: vscode.SymbolKind.Function | vscode.SymbolKind.Method,
): vscode.CompletionItem[] {
    return [...valMap.values()].map((v: TValMetaOut): vscode.CompletionItem => {
        const {
            keyRawName,
            refRangeList,
            defRangeList,
            commentList,
            jsDocStyle,
            // ahkValType,
        } = v;
        // const typeValType = getAhkTypeName(ahkValType);
        return setItemCore({
            prefix: EPrefix.var,
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

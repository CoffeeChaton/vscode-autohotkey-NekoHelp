import * as vscode from 'vscode';
import type { TTextMapOut, TTextMetaOut } from '../../../../AhkSymbol/CAhkFunc';
import { EPrefix } from '../../../../tools/MD/setMD';
import type { TSnippetRecMap } from '../ESnippetRecBecause';
import { setItemCore } from './setItem';

export function getUnknownTextCompletion(
    textMap: TTextMapOut,
    funcName: string,
    kind: vscode.SymbolKind.Function | vscode.SymbolKind.Method,
): vscode.CompletionItem[] {
    const recMap: TSnippetRecMap = new Map();
    return [...textMap.values()].map((v: TTextMetaOut): vscode.CompletionItem => {
        const { keyRawName, refRangeList } = v;
        return setItemCore({
            prefix: EPrefix.unKnownText,
            recMap,
            keyRawName,
            funcName,
            refRangeList,
            defRangeList: [],
            snipKind: vscode.CompletionItemKind.Text,
            kind,
            commentList: [],
            jsDocStyle: '',
        });
    });
}

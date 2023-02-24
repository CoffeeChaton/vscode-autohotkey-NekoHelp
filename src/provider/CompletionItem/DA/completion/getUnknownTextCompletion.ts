import * as vscode from 'vscode';
import type { TTextMapOut, TTextMetaOut } from '../../../../AhkSymbol/CAhkFunc';
import { EPrefix } from '../../../../tools/MD/setMD';
import { setItemCore } from './setItem';

export function getUnknownTextCompletion(
    textMap: TTextMapOut,
    funcName: string,
    kind: vscode.SymbolKind.Function | vscode.SymbolKind.Method,
): vscode.CompletionItem[] {
    const recMap = new Map();
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

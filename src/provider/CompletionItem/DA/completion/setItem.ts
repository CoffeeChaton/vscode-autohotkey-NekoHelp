import * as vscode from 'vscode';
import type { EPrefix } from '../../../../tools/MD/setMD';
import { setMD } from '../../../../tools/MD/setMD';
import type { ESnippetRecBecause, TSnippetRecMap } from '../ESnippetRecBecause';

type TSetItem = {
    prefix: EPrefix,
    recMap: TSnippetRecMap,
    keyRawName: string,
    funcName: string,
    refRangeList: readonly vscode.Range[],
    defRangeList: readonly vscode.Range[],
    snipKind: vscode.CompletionItemKind,
    kind: vscode.SymbolKind.Function | vscode.SymbolKind.Method,
    commentList: readonly string[],
    jsDocStyle: string,
};

export function setItemCore(
    {
        prefix,
        recMap,
        keyRawName,
        funcName,
        refRangeList,
        defRangeList,
        snipKind,
        kind,
        commentList,
        jsDocStyle,
    }: TSetItem,
): vscode.CompletionItem {
    const recStr: ESnippetRecBecause | undefined = recMap.get(keyRawName);

    const kindStr = kind === vscode.SymbolKind.Function
        ? 'this Function'
        : 'this Method';
    const label: vscode.CompletionItemLabel = {
        label: keyRawName,
        description: recStr === undefined
            ? kindStr // "⌬ ";
            : `✿ ${kindStr}`,
    };

    const item: vscode.CompletionItem = new vscode.CompletionItem(label);
    item.kind = snipKind; // vscode.CompletionItemKind.Variable;
    item.insertText = keyRawName;
    item.detail = `${prefix} (neko-help-DeepAnalysis)`;

    item.documentation = setMD({
        prefix,
        refRangeList,
        defRangeList,
        funcName,
        recStr: recStr ?? '',
        commentList,
        jsDocStyle,
    });

    if (recStr !== undefined) {
        item.preselect = true;
        // String.fromCharCode(0)
    }

    return item;
}

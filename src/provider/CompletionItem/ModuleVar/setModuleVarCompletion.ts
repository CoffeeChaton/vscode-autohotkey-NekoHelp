import * as vscode from 'vscode';
import type { CAhkFunc, TValMapOut, TValMetaOut } from '../../../AhkSymbol/CAhkFunc';
import { getConfig } from '../../../configUI';
import { EPrefix, setMD } from '../../../tools/MD/setMD';
import type { ESnippetRecBecause, TSnippetRecMap } from '../DA/ESnippetRecBecause';

function needGlobalHead(DA: CAhkFunc | null, v: TValMetaOut): boolean {
    if (DA === null) return false;

    const DARange: vscode.Range = DA.range;

    for (const { range } of [...v.refRangeList, ...v.defRangeList]) {
        if (DARange.contains(range)) return false;
    }

    return true;
}
export function setModuleVarCompletion(
    {
        ModuleValMap,
        fileName,
        recMap,
        DA,
    }: { ModuleValMap: TValMapOut, fileName: string, recMap: TSnippetRecMap, DA: CAhkFunc | null },
): vscode.CompletionItem[] {
    const insertGlobal: boolean = getConfig().snippets.autoInsertGlobal;
    return [...ModuleValMap.values()].map((v: TValMetaOut): vscode.CompletionItem => {
        const {
            keyRawName,
            refRangeList,
            defRangeList,
            commentList,
            jsDocStyle,
        } = v;

        const recStr: ESnippetRecBecause | undefined = recMap.get(keyRawName);

        const label: vscode.CompletionItemLabel = {
            label: DA === null
                ? keyRawName
                : `${keyRawName} (global)`,

            description: recStr === undefined
                ? fileName // "⌬ ";
                : `✿ ${fileName}`,
        };

        const item: vscode.CompletionItem = new vscode.CompletionItem(label);
        item.kind = vscode.CompletionItemKind.Variable; // vscode.CompletionItemKind.Variable;

        item.insertText = insertGlobal && needGlobalHead(DA, v)
            ? `global ${keyRawName}`
            : keyRawName;
        item.sortText = keyRawName;
        item.detail = `${EPrefix.var} (neko-help-ModuleVar)`;

        item.documentation = setMD({
            prefix: EPrefix.var,
            refRangeList,
            defRangeList,
            funcName: '',
            recStr: recStr ?? '',
            commentList,
            jsDocStyle,
        });

        if (recStr !== undefined) {
            item.preselect = true;
            // String.fromCharCode(0)
        }

        return item;
    });
}

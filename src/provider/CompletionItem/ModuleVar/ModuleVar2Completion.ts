import path from 'node:path';
import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TModuleVar } from '../../../tools/DeepAnalysis/getModuleVarMap';
import type { TSnippetRecMap } from '../DA/ESnippetRecBecause';
import { ESnippetRecBecause } from '../DA/ESnippetRecBecause';
import { setModuleVarCompletion } from './setModuleVarCompletion';

export function ModuleVar2Completion(
    ModuleVar: TModuleVar,
    DA: CAhkFunc | null,
    inputStr: string,
    fsPath: string,
): vscode.CompletionItem[] {
    const { ModuleValMap } = ModuleVar;

    const recMap: TSnippetRecMap = new Map();
    for (const { keyRawName } of ModuleValMap.values()) {
        if (keyRawName.startsWith(inputStr)) {
            recMap.set(keyRawName, ESnippetRecBecause.varStartWith);
        }
    }

    return setModuleVarCompletion({
        ModuleValMap,
        recMap,
        DA,
        fileName: path.basename(fsPath),
    });
}

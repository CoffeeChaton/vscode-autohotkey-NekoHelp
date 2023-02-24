import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { getParamCompletion } from './completion/getArgCompletion';
import { getUnknownTextCompletion } from './completion/getUnknownTextCompletion';
import { getValCompletion } from './completion/getValCompletion';
import type { TSnippetRecMap } from './ESnippetRecBecause';
import { getRecMap } from './rec/getRecMap';

export function DeepAnalysisToCompletionItem(
    DA: CAhkFunc,
    inputStr: string,
): vscode.CompletionItem[] {
    const {
        paramMap,
        valMap,
        textMap,
        kind,
        name,
    } = DA;

    const recMap: TSnippetRecMap = getRecMap(DA, inputStr);

    return [
        ...getParamCompletion(paramMap, name, recMap, kind),
        ...getValCompletion(valMap, name, recMap, kind),
        ...getUnknownTextCompletion(textMap, name, kind),
    ];
}

// don't use weakMap Memo, because position && inputStr

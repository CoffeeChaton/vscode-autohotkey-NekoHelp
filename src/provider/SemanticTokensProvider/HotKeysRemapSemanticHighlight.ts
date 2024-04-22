import * as vscode from 'vscode';
import { CAhkHotKeys } from '../../AhkSymbol/CAhkHotKeys';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TSemanticTokensLeaf } from './tools';

export function HotKeysRemapSemanticHighlight(AhkFileData: TAhkFileData): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    const { AST } = AhkFileData;

    for (const AhkSymbol of AST) {
        if (AhkSymbol instanceof CAhkHotKeys && AhkSymbol.detail === 'Remap') {
            //    const { line, character } = AhkSymbol.selectionRange.start;

            const range: vscode.Range = new vscode.Range(
                AhkSymbol.selectionRange.end,
                AhkSymbol.range.end,
            );
            Tokens.push({
                range,
                tokenType: 'keyword',
                tokenModifiers: [],
            });
        }
    }

    return Tokens;
}

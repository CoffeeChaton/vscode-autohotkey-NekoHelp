import * as vscode from 'vscode';
import { CAhkHotKeys } from '../../AhkSymbol/CAhkHotKeys';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import type { TSemanticTokensLeaf } from './tools';

export function HotKeysRemapSemanticHighlight(AST: TAstRoot): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
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

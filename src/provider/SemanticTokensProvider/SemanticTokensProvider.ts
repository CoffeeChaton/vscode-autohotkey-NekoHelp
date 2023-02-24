import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { CMemo } from '../../tools/CMemo';
import { DAList2SemanticHighlight } from './DAList2SemanticHighlight';
import { funcHighlight } from './funcHighlight';
import { ModuleVarSemantic } from './ModuleVarSemantic';
import { MultilineHighlight } from './MultilineHighlight';
import { pushToken, TokenModifiers, TokenTypes } from './tools';
// https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers

export const legend: vscode.SemanticTokensLegend = new vscode.SemanticTokensLegend(
    [...TokenTypes],
    [...TokenModifiers],
);

const Semantic = new CMemo<TAhkFileData, vscode.SemanticTokens>((AhkFileData: TAhkFileData): vscode.SemanticTokens => {
    const { AST, ModuleVar, DocStrMap } = AhkFileData;

    const tokensBuilder: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);

    pushToken([
        ...DAList2SemanticHighlight(AST),
        ...ModuleVarSemantic(ModuleVar),
        ...funcHighlight(DocStrMap),
        ...MultilineHighlight(DocStrMap),
    ], tokensBuilder);

    return tokensBuilder.build();
});

// semantic token type
export const AhkFullSemanticHighlight: vscode.DocumentSemanticTokensProvider = {
    // onDidChangeSemanticTokens?: vscode.Event<void> | undefined;
    provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
        if (AhkFileData === null) return null;

        return Semantic.up(AhkFileData);
    },
};

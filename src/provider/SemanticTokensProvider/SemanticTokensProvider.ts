import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { CMemo } from '../../tools/CMemo';
import { ClassHighlight } from './ClassHighlight';
import { DAList2SemanticHighlight } from './DAList2SemanticHighlight';
import { funcHighlight } from './funcHighlight';
import { legacyAssignmentHighlight } from './legacyAssignmentHighlight';
import { ModuleVarSemantic } from './ModuleVarSemantic';
import { MultilineHighlight } from './MultilineHighlight';
import type { TSemanticTokensLeaf } from './tools';
import { TokenModifiers, TokenTypes } from './tools';
// https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers

export const legend: vscode.SemanticTokensLegend = new vscode.SemanticTokensLegend(
    [...TokenTypes],
    [...TokenModifiers],
);

const Semantic = new CMemo<TAhkFileData, readonly TSemanticTokensLeaf[]>(
    (AhkFileData: TAhkFileData): readonly TSemanticTokensLeaf[] => {
        const { AST, ModuleVar, DocStrMap } = AhkFileData;

        return [
            ...DAList2SemanticHighlight(AST),
            ...ModuleVarSemantic(ModuleVar),
            ...funcHighlight(DocStrMap),
            ...MultilineHighlight(DocStrMap),
            ...legacyAssignmentHighlight(DocStrMap),
        ];
    },
);

// semantic token type
export const AhkFullSemanticHighlight: vscode.DocumentSemanticTokensProvider = {
    // onDidChangeSemanticTokens?: vscode.Event<void> | undefined;
    provideDocumentSemanticTokens(
        document: vscode.TextDocument,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
        if (AhkFileData === null) return null;

        const tokensBuilder: vscode.SemanticTokensBuilder = new vscode.SemanticTokensBuilder(legend);
        for (
            const { range, tokenType, tokenModifiers } of [
                // limited memo, related to the file system
                ...ClassHighlight(AhkFileData),

                // safe memo
                ...Semantic.up(AhkFileData),
            ]
        ) {
            // Obtain first, render first, no weight api found yet
            tokensBuilder.push(
                range,
                tokenType,
                tokenModifiers,
            );
        }

        return tokensBuilder.build();
    },
};

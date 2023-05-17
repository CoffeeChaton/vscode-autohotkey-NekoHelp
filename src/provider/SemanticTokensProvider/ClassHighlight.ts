import type * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { CMemo } from '../../tools/CMemo';
import { getAllClass } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { classRefOnePage } from '../Def/searchAllClassRef';
import type { TSemanticTokensLeaf } from './tools';

const memoClassHighlight = new CMemo<readonly vscode.Location[], readonly TSemanticTokensLeaf[]>(
    (locList: readonly vscode.Location[]): readonly TSemanticTokensLeaf[] => {
        const Tokens: TSemanticTokensLeaf[] = [];
        for (const { range } of locList) {
            Tokens.push({
                range,
                tokenType: 'class',
                tokenModifiers: [],
            });
        }

        return Tokens;
    },
);

export function ClassHighlight(AhkFileData: TAhkFileData): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
    for (const ahkClass of getAllClass().values()) {
        const locList: readonly vscode.Location[] = classRefOnePage(ahkClass, AhkFileData);
        Tokens.push(...memoClassHighlight.up(locList));
    }

    return Tokens;
}

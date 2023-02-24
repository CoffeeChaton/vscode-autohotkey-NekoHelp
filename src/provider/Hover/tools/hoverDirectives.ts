import * as vscode from 'vscode';
import { CAhkInclude } from '../../../AhkSymbol/CAhkInclude';
import { CAhkDirectives } from '../../../AhkSymbol/CAhkLine';
import type { TAhkSymbolList, TAstRoot } from '../../../AhkSymbol/TAhkSymbolIn';
import { DirectivesMDMap } from '../../../tools/Built-in/Directives.tool';

function findDirectivesWithPos(
    AST: Readonly<TAhkSymbolList>,
    position: vscode.Position,
): CAhkDirectives | CAhkInclude | undefined {
    for (const ah of AST) {
        if (ah.selectionRange.contains(position)) {
            return ah instanceof CAhkDirectives || ah instanceof CAhkInclude
                ? ah
                : findDirectivesWithPos(ah.children, position);
        }
    }
    return undefined;
}

const unknownDirectivesMD = new vscode.MarkdownString(
    'unknown #Directives in ahk-v1\n [[read doc]](https://www.autohotkey.com/docs/v1/lib/index.htm)',
    true,
);

export function hoverDirectives(
    position: vscode.Position,
    AstRoot: TAstRoot,
): vscode.MarkdownString | undefined {
    const ah: CAhkDirectives | CAhkInclude | undefined = findDirectivesWithPos(AstRoot, position);
    if (ah === undefined) return undefined;

    const md: vscode.MarkdownString | undefined = DirectivesMDMap.get(ah.hashtag);
    if (md !== undefined) return md;
    return unknownDirectivesMD;
}

import { CAhkClassGetSet } from '../../AhkSymbol/CAhkClass';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getFileAllClass } from '../../tools/visitor/getFileAllClassList';
import type { TSemanticTokensLeaf } from './tools';

export function classPropertyHighlight(AST: TAstRoot): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    for (const ahkClass of getFileAllClass(AST)) {
        for (const ch of ahkClass.children) {
            if (ch instanceof CAhkClassGetSet) {
                Tokens.push({
                    range: ch.selectionRange,
                    tokenType: 'property',
                    tokenModifiers: [],
                });
            }
        }
    }

    return Tokens;
}

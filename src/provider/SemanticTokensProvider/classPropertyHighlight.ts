import { CAhkClassPropertyDef } from '../../AhkSymbol/CAhkClass';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getFileAllClass } from '../../tools/visitor/getFileAllClassList';
import type { TSemanticTokensLeaf } from './tools';

export function classPropertyHighlight(AST: TAstRoot): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    for (const ahkClass of getFileAllClass(AST)) {
        for (const ch of ahkClass.children) {
            if (ch instanceof CAhkClassPropertyDef) {
                Tokens.push({
                    range: ch.selectionRange,
                    tokenType: 'property',
                    tokenModifiers: [],
                });

                for (const GetSet of ch.children) {
                    Tokens.push({
                        range: GetSet.selectionRange,
                        tokenType: 'method',
                        tokenModifiers: [],
                    });
                }
            }
        }
    }

    return Tokens;
}

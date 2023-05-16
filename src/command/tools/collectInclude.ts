import { CAhkInclude } from '../../AhkSymbol/CAhkInclude';
import type { TAhkSymbolList, TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { CMemo } from '../../tools/CMemo';

function collectIncludeCore(AST: Readonly<TAhkSymbolList>): readonly CAhkInclude[] {
    const List: CAhkInclude[] = [];
    for (const ahkInclude of AST) {
        if (ahkInclude instanceof CAhkInclude) {
            List.push(ahkInclude);
        } else {
            List.push(...collectIncludeCore(ahkInclude.children));
        }
    }
    return List;
}

const collectIncludeTop = new CMemo<TAstRoot, readonly CAhkInclude[]>(
    (AST: TAstRoot): readonly CAhkInclude[] => collectIncludeCore(AST),
);

export function collectInclude(AST: TAstRoot): readonly CAhkInclude[] {
    return collectIncludeTop.up(AST);
}

import { CAhkInclude } from '../../AhkSymbol/CAhkInclude';
import type { TAhkSymbolList } from '../../AhkSymbol/TAhkSymbolIn';

export function collectInclude(AST: Readonly<TAhkSymbolList>): readonly CAhkInclude[] {
    const List: CAhkInclude[] = [];
    for (const ahkInclude of AST) {
        if (ahkInclude instanceof CAhkInclude) {
            List.push(ahkInclude);
        } else {
            List.push(...collectInclude(ahkInclude.children));
        }
    }
    return List;
}

import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';

// FIXME:
const wmClass = new WeakMap<TAstRoot, readonly CAhkClass[]>();

export function getFileAllClass(AstRoot: TAstRoot): readonly CAhkClass[] {
    const cache: readonly CAhkClass[] | undefined = wmClass.get(AstRoot);
    if (cache !== undefined) {
        return cache;
    }

    const result: CAhkClass[] = [];
    for (const DA of AstRoot) {
        if (DA instanceof CAhkClass) {
            result.push(DA);
        }
    }

    wmClass.set(AstRoot, result);

    return result;
}

import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { CMemo } from '../CMemo';

export const getFileAllFunc = new CMemo<TAstRoot, readonly CAhkFunc[]>((AstRoot: TAstRoot): readonly CAhkFunc[] => {
    const result: CAhkFunc[] = [];
    for (const DA of AstRoot) {
        if (DA instanceof CAhkFunc) {
            result.push(DA);
        }
    }
    return result;
});

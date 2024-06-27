import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { CMemo } from '../CMemo';

export const getFileAllFunc: CMemo<TAstRoot, readonly CAhkFunc[]> = new CMemo(
    (AstRoot: TAstRoot): readonly CAhkFunc[] => {
        const result: CAhkFunc[] = [];
        for (const DA of AstRoot) {
            if (DA instanceof CAhkFunc) {
                result.push(DA);
            }
        }
        return result;
    },
);

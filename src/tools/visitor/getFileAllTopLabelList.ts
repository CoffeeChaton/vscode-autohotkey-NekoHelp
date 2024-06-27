import { CAhkLabel } from '../../AhkSymbol/CAhkLine';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { CMemo } from '../CMemo';

export const getFileAllTopLabelList: CMemo<TAstRoot, readonly CAhkLabel[]> = new CMemo(
    (AstRoot: TAstRoot): readonly CAhkLabel[] => {
        const result: CAhkLabel[] = [];
        for (const DA of AstRoot) {
            if (DA instanceof CAhkLabel) {
                result.push(DA);
            }
        }

        return result;
    },
);

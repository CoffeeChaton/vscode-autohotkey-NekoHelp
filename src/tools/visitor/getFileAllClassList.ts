import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { CMemo } from '../CMemo';

const fileAllClassMemo = new CMemo<TAstRoot, readonly CAhkClass[]>((AstRoot: TAstRoot): readonly CAhkClass[] => {
    const result: CAhkClass[] = [];
    for (const DA of AstRoot) {
        if (DA instanceof CAhkClass) {
            result.push(DA);
        }
    }
    return result;
});

export function getFileAllClass(AstRoot: TAstRoot): readonly CAhkClass[] {
    return fileAllClassMemo.up(AstRoot);
}

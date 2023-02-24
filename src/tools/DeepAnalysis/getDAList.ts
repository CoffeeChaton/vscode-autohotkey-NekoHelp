import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkSymbolList, TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { CMemo } from '../CMemo';
import { getFileAllClass } from '../visitor/getFileAllClassList';
import { getFileAllFunc } from '../visitor/getFileAllFuncList';

function getDAList(AST: Readonly<TAhkSymbolList>, result: CAhkFunc[]): void {
    for (const DA of AST) {
        if (DA instanceof CAhkFunc) {
            result.push(DA);
        } else if (DA instanceof CAhkClass) {
            getDAList(DA.children, result);
        }
    }
}

const DAListMemo = new CMemo<TAstRoot, readonly CAhkFunc[]>((AstRoot: TAstRoot): readonly CAhkFunc[] => {
    const result: CAhkFunc[] = [...getFileAllFunc.up(AstRoot)];
    for (const DA of getFileAllClass(AstRoot)) {
        getDAList(DA.children, result);
    }
    return result;
});

export function getDAListTop(AstRoot: TAstRoot): readonly CAhkFunc[] {
    return DAListMemo.up(AstRoot);
}

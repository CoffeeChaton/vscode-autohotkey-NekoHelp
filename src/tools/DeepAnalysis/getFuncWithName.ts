import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';
import { getFileAllFuncMap } from '../visitor/getFileAllFuncMap';

export function getFuncWithName(wordUP: string): CAhkFunc | null {
    for (const { AST } of pm.getDocMapValue()) {
        const ahkFunc: CAhkFunc | undefined = getFileAllFuncMap(AST).get(wordUP);
        if (ahkFunc !== undefined) {
            return ahkFunc;
        }
    }
    return null;
}

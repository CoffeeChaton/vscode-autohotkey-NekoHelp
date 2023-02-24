import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';
import { getFileAllFuncMap } from '../visitor/getFileAllFuncMap';

export type TFullFuncMap = ReadonlyMap<string, CAhkFunc>;

export function getAllFunc(): TFullFuncMap {
    const allMap: [string, CAhkFunc][] = [];

    for (const { AST } of pm.getDocMapValue()) {
        allMap.push(...getFileAllFuncMap(AST));
    }

    return new Map<string, CAhkFunc>(allMap);
}

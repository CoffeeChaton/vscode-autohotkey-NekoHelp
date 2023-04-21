import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { pm } from '../../core/ProjectManager';
import { getFileAllClassMap } from '../visitor/getFileAllClassMap';

export function getUserDefTopClassSymbol(wordUP: string): CAhkClass | null {
    for (const { AST } of pm.getDocMapValue()) {
        const ahkClass: CAhkClass | undefined = getFileAllClassMap(AST).get(wordUP);
        if (ahkClass !== undefined) {
            return ahkClass;
        }
    }
    return null;
}

export type TFullClassMap = ReadonlyMap<string, CAhkClass>;

export function getAllClass(): TFullClassMap {
    const allMap: [string, CAhkClass][] = [];

    for (const { AST } of pm.getDocMapValue()) {
        allMap.push(...getFileAllClassMap(AST));
    }

    return new Map<string, CAhkClass>(allMap);
}

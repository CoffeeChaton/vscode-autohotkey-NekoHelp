import { CAhkLabel } from '../AhkSymbol/CAhkLine';
import type { TAhkSymbol, TAstRoot } from '../AhkSymbol/TAhkSymbolIn';
import { pm } from '../core/ProjectManager';
import { CMemo } from './CMemo';

type TLabelMapRW = Map<string, CAhkLabel[]>;
type TLabelMap = ReadonlyMap<string, CAhkLabel[]>;

function findAllLabelAllMapCore(ch: readonly TAhkSymbol[], map: TLabelMapRW): void {
    for (const AhkSymbol of ch) {
        if (AhkSymbol.children.length > 0) {
            findAllLabelAllMapCore(AhkSymbol.children, map);
        } else if (AhkSymbol instanceof CAhkLabel) {
            const arr: CAhkLabel[] = map.get(AhkSymbol.upName) ?? [];
            arr.push(AhkSymbol);
            map.set(AhkSymbol.upName, arr);
        }
    }
}

export const findAllLabelAllMap: CMemo<TAstRoot, TLabelMap> = new CMemo((AST: TAstRoot): TLabelMap => {
    const LabelMap: TLabelMapRW = new Map();
    findAllLabelAllMapCore(AST, LabelMap);
    return LabelMap;
});

export function findLabelAll(wordUpCase: string): CAhkLabel[] {
    const list: CAhkLabel[] = [];
    for (const { AST } of pm.getDocMapValue()) {
        const labelList: CAhkLabel[] | undefined = findAllLabelAllMap.up(AST).get(wordUpCase);
        if (labelList !== undefined) {
            list.push(...labelList);
        }
    }
    return list;
}

/* eslint no-magic-numbers: ["error", { "ignore": [-5,0,5] }] */
import type { TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import type { TSnippetRecMap } from '../ESnippetRecBecause';
import { ESnippetRecBecause } from '../ESnippetRecBecause';

export function setVarRec(Rec: TSnippetRecMap, valMap: TValMapOut, inputStr: string): void {
    for (const { keyRawName } of valMap.values()) {
        if (keyRawName.startsWith(inputStr)) {
            Rec.set(keyRawName, ESnippetRecBecause.varStartWith);
        }
    }
}

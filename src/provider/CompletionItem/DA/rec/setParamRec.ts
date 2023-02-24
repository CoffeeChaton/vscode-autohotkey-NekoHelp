import type { TParamMapOut } from '../../../../AhkSymbol/CAhkFunc';
import type { TSnippetRecMap } from '../ESnippetRecBecause';
import { ESnippetRecBecause } from '../ESnippetRecBecause';

export function setParamRec(suggestMap: TSnippetRecMap, paramMap: TParamMapOut, inputStr: string): void {
    for (const paramMeta of paramMap.values()) {
        // startsWith
        if (paramMeta.keyRawName.startsWith(inputStr)) {
            suggestMap.set(paramMeta.keyRawName, ESnippetRecBecause.paramStartWith);
            continue;
        }

        // parm is Never user
        if (paramMeta.refRangeList.length === 0) {
            suggestMap.set(paramMeta.keyRawName, ESnippetRecBecause.paramNeverUsed);
        }
    }
}

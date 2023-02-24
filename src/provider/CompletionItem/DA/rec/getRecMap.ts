import type { CAhkFunc } from '../../../../AhkSymbol/CAhkFunc';
import type { TSnippetRecMap } from '../ESnippetRecBecause';
import { setParamRec } from './setParamRec';
import { setVarRec } from './setVarRec';

export function getRecMap(ed: CAhkFunc, inputStr: string): TSnippetRecMap {
    const { paramMap, valMap } = ed;
    const Rec: TSnippetRecMap = new Map();

    setParamRec(Rec, paramMap, inputStr);

    setVarRec(Rec, valMap, inputStr);

    return Rec;
}

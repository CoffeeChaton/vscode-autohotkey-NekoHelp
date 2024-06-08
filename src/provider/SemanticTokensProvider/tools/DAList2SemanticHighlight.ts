import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../../AhkSymbol/TAhkSymbolIn';
import { hoverAVar } from '../../../tools/Built-in/1_built_in_var/A_Variables.tools';
import { hoverBiVar } from '../../../tools/Built-in/1_built_in_var/BiVariables.tools';
import { getDAListTop } from '../../../tools/DeepAnalysis/getDAList';
import type { TSemanticTokensLeaf } from '../tools';

function DA2SemanticHighlight(fn: CAhkFunc): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
    const { paramMap, valMap } = fn;
    for (const { defRangeList, refRangeList } of paramMap.values()) {
        for (const { range } of [...defRangeList, ...refRangeList]) {
            Tokens.push({
                range,
                tokenType: 'parameter', // <---------------
                tokenModifiers: [],
            });
        }
    }
    for (const [k, { defRangeList, refRangeList }] of valMap) {
        if (hoverBiVar(k) !== undefined || hoverAVar(k) !== undefined) continue;

        for (const { range } of [...defRangeList, ...refRangeList]) {
            Tokens.push({
                range,
                tokenType: 'variable', // <---------------
                tokenModifiers: [],
            });
        }
    }

    return Tokens;
}

export function DAList2SemanticHighlight(AstRoot: TAstRoot): TSemanticTokensLeaf[] {
    return getDAListTop(AstRoot)
        .flatMap((fn: CAhkFunc): TSemanticTokensLeaf[] => DA2SemanticHighlight(fn));
}

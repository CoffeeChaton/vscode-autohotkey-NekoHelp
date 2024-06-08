import { hoverAVar } from '../../../tools/Built-in/1_built_in_var/A_Variables.tools';
import { hoverBiVar } from '../../../tools/Built-in/1_built_in_var/BiVariables.tools';
import type { TModuleVar } from '../../../tools/DeepAnalysis/getModuleVarMap';
import type { TSemanticTokensLeaf } from '../tools';

export function ModuleVarSemantic(ModuleVar: TModuleVar): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
    const { ModuleValMap } = ModuleVar;
    for (const [k, { defRangeList, refRangeList }] of ModuleValMap) {
        if (hoverBiVar(k) !== undefined || hoverAVar(k) !== undefined) continue;

        for (const { range } of [...defRangeList, ...refRangeList]) {
            Tokens.push({
                range,
                tokenType: 'variable',
                tokenModifiers: [],
            });
        }
    }

    return Tokens;
}

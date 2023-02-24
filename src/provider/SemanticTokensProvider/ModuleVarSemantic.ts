import type { TModuleVar } from '../../tools/DeepAnalysis/getModuleVarMap';
import type { TSemanticTokensLeaf } from './tools';

export function ModuleVarSemantic(ModuleVar: TModuleVar): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
    const { ModuleValMap } = ModuleVar;
    for (const { defRangeList, refRangeList } of ModuleValMap.values()) {
        for (const range of [...defRangeList, ...refRangeList]) {
            Tokens.push({
                range,
                tokenType: 'variable',
                tokenModifiers: [],
            });
        }
    }

    return Tokens;
}

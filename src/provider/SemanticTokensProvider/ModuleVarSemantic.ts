import type { TModuleVar } from '../../tools/DeepAnalysis/getModuleVarMap';
import type { TSemanticTokensLeaf } from './tools';

export function ModuleVarSemantic(ModuleVar: TModuleVar): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
    const { ModuleValMap } = ModuleVar;
    for (const [k, { defRangeList, refRangeList }] of ModuleValMap) {
        if (k === 'CLIPBOARD' || k === 'CLIPBOARDALL') continue;

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

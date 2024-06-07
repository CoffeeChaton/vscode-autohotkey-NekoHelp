import type { TAhkFileData } from '../../../core/ProjectManager';
import { memGuiMenuRef } from '../../Def/getMenuNameRef';
import type { TSemanticTokensLeaf } from '../tools';

export function GuiMenuHighlight(AhkFileData: TAhkFileData): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
    for (const refList of memGuiMenuRef.up(AhkFileData).values()) {
        for (const ref of refList) {
            Tokens.push({
                range: ref.range,
                tokenType: 'variable',
                tokenModifiers: ['readonly'],
            });
        }
    }
    return Tokens;
}

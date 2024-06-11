import type { TTokenStream } from '../../../globalEnum';
import type { CDiagBase } from '../../Diagnostic/tools/CDiagBase';
import { cIf_legacyErrList } from '../../Diagnostic/tools/lineErr/getIf_legacyErr';
import type { TSemanticTokensLeaf } from '../tools';

export function if_legacy_SemanticHighlight(DocStrMap: TTokenStream): readonly TSemanticTokensLeaf[] {
    const oldIf: readonly CDiagBase[] = cIf_legacyErrList.up(DocStrMap)
        .filter((v: CDiagBase | null): v is CDiagBase => v !== null);

    return oldIf
        .map((v: CDiagBase): TSemanticTokensLeaf => ({
            range: v.range,
            tokenType: 'string',
            tokenModifiers: ['deprecated'],
        }));
}

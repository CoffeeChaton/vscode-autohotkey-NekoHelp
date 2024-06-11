import type { TTokenStream } from '../../../globalEnum';
import type { CDiagBase } from '../../Diagnostic/tools/CDiagBase';
import { memoIf_legacyErrCode210 } from '../../Diagnostic/tools/lineErr/getIf_legacy210Err';
import type { TSemanticTokensLeaf } from '../tools';

export function if_legacy_SemanticHighlight(DocStrMap: TTokenStream): readonly TSemanticTokensLeaf[] {
    const oldIf: readonly CDiagBase[] = memoIf_legacyErrCode210.up(DocStrMap)
        .filter((v: CDiagBase | null): v is CDiagBase => v !== null);

    return oldIf
        .map((v: CDiagBase): TSemanticTokensLeaf => ({
            range: v.range,
            tokenType: 'string',
            tokenModifiers: ['deprecated'],
        }));
}

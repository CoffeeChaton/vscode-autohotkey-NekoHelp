/* eslint-disable no-magic-numbers */
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getDiagConfig } from '../../configUI';
import { diagColl, getWithOutNekoDiag } from '../../core/diagColl';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import type { CDiagBase } from './tools/CDiagBase';
import { getFuncSizeErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getMultilineDiag } from './tools/getMultilineDiag';
import { getTreeErr } from './tools/getTreeErr';
import { getAssignErr } from './tools/lineErr/assignErr';
import { getCode304Err } from './tools/lineErr/getCode304Err';
import { getCode601Err } from './tools/lineErr/getCode601Err';

const wm = new WeakMap<TTokenStream, readonly CDiagBase[]>();

// TODO use CMemo
function baseDiagnostic(DocStrMap: TTokenStream, AST: TAstRoot): readonly CDiagBase[] {
    const cache: readonly CDiagBase[] | undefined = wm.get(DocStrMap);
    if (cache !== undefined) return cache;

    const displayErrList: readonly boolean[] = DocStrMap.map(({ displayErr }: TAhkTokenLine): boolean => displayErr);

    const diagList: readonly CDiagBase[] = [
        ...getLineErr(DocStrMap),
        ...getTreeErr(AST, displayErrList),
        ...getMultilineDiag(DocStrMap),
    ];
    wm.set(DocStrMap, diagList);
    return diagList;
}

export function setBaseDiag(AhkFileData: TAhkFileData): void {
    const {
        uri,
        AST,
        DocStrMap,
    } = AhkFileData;
    const baseDiagSet = new Set<CDiagBase>(baseDiagnostic(DocStrMap, AST));

    const DiagShow: CDiagBase[] = [
        ...getCode601Err(AhkFileData),
    ];
    const {
        code800Deprecated,
        code107,
        code304,
        code300fnSize,
    } = getDiagConfig();

    for (const diag of baseDiagSet) {
        const { value } = diag.code;
        if ((value > 800 && value < 900) && !code800Deprecated) {
            continue;
        }
        DiagShow.push(diag);
    }
    if (code107) {
        DiagShow.push(...getAssignErr(DocStrMap));
    }
    if (code304) {
        DiagShow.push(...getCode304Err(AhkFileData));
    }

    diagColl.set(uri, [
        ...getWithOutNekoDiag(diagColl.get(uri) ?? []),
        ...DiagShow,
        ...getFuncSizeErr(getDAListTop(AST), DocStrMap, code300fnSize),
    ]);
}

/* eslint-disable no-magic-numbers */
import { getConfig } from '../../configUI';
import { diagColl, getWithOutNekoDiag } from '../../core/diagColl';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { CMemo } from '../../tools/CMemo';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import type { CDiagBase } from './tools/CDiagBase';
import { getFuncSizeErr } from './tools/getFuncErr';
import { getLineErr } from './tools/getLineErr';
import { getMultilineDiag } from './tools/getMultilineDiag';
import { getTreeErr } from './tools/getTreeErr';
import { getAssignErr } from './tools/lineErr/assignErr';
import { getCode601Err } from './tools/lineErr/getCode601Err';
import { getCode701Err } from './tools/lineErr/getCode701Err';
import { memoIf_legacyErrCode210 } from './tools/lineErr/getIf_legacy210Err';
import { memoIf_style } from './tools/lineErr/getIf_style_209info';

const wmBaseDiagnostic = new CMemo(
    (AhkFileData: TAhkFileData): ReadonlySet<CDiagBase> => {
        const {
            AST,
            DocStrMap,
        } = AhkFileData;

        const displayErrList: readonly boolean[] = DocStrMap
            .map(({ displayErr }: TAhkTokenLine): boolean => displayErr);

        const diagList: readonly CDiagBase[] = [
            ...getLineErr(DocStrMap),
            ...getTreeErr(AST, displayErrList, DocStrMap),
            ...getMultilineDiag(DocStrMap),
        ];
        return new Set(diagList);
    },
);

export function setBaseDiag(AhkFileData: TAhkFileData): void {
    const {
        uri,
        AST,
        DocStrMap,
    } = AhkFileData;
    const baseDiagSet: ReadonlySet<CDiagBase> = wmBaseDiagnostic.up(AhkFileData);

    const DiagShow: CDiagBase[] = [
        ...getCode601Err(AhkFileData),
        ...getCode701Err(AhkFileData),
    ];

    const {
        code800Deprecated,
        code107,
        code209,
        code210,
        code300fnSize,
    } = getConfig().Diag;

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
    if (code209) {
        DiagShow.push(...memoIf_style.up(DocStrMap));
    }
    if (code210) {
        const displayErrList: readonly boolean[] = DocStrMap
            .map(({ displayErr }: TAhkTokenLine): boolean => displayErr);
        const oldIf: readonly CDiagBase[] = memoIf_legacyErrCode210.up(DocStrMap)
            .filter((v: CDiagBase | null): v is CDiagBase => v !== null)
            .filter((v: CDiagBase): boolean => displayErrList[v.range.start.line]);
        DiagShow.push(...oldIf);
    }

    diagColl.set(uri, [
        ...getWithOutNekoDiag(diagColl.get(uri) ?? []),
        ...DiagShow,
        ...getFuncSizeErr(getDAListTop(AST), DocStrMap, code300fnSize),
    ]);
}

import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { getDiagConfig } from '../../../configUI';
import { diagColl } from '../../../core/diagColl';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { CDiagFn } from '../../../provider/Diagnostic/tools/CDiagFn';
import type { C500Class } from '../../../provider/Diagnostic/tools/CDiagFnLib/C500Class';
import type { C501Class } from '../../../provider/Diagnostic/tools/CDiagFnLib/C501Class';
import type { C502Class } from '../../../provider/Diagnostic/tools/CDiagFnLib/C502Class';
import { EPrefixC502 } from '../../../provider/Diagnostic/tools/CDiagFnLib/C502Class';
import type { C504Class } from '../../../provider/Diagnostic/tools/CDiagFnLib/C504Class';
import type { C505Class } from '../../../provider/Diagnostic/tools/CDiagFnLib/C505Class';
import type { C506Class } from '../../../provider/Diagnostic/tools/CDiagFnLib/C506Class';
import { getDAListTop } from '../getDAList';
import { c511banVarNam } from './banName/c511banVarNam';
import { c512banGlobalVarName } from './banName/c512banGlobalVarName';
import { c513banLabelName } from './banName/c513banLabelName';
import { caseSensitivityVar } from './caseSensitivity';
import { C506DiagNumberStyle } from './otherDiag/C506DiagNumberStyle';
import { NeverUsedParam, NeverUsedVar } from './param/paramNeverUsed';
import { c505ErrParamParsedError } from './param/paramParsedErrRange';
import { paramVariadicErr } from './param/paramVariadicErr';

type TDaDiagCache = {
    DADiagList: readonly CDiagFn[],
    code500Max: number,
    code502Max: number,
    code503Max: number,
    useModuleValDiag: boolean,
};

const wm = new WeakMap<readonly CAhkFunc[], TDaDiagCache>();

function diagDAFileCore(
    AhkFileData: TAhkFileData,
    displayErrList: readonly boolean[],
): readonly CDiagFn[] {
    const {
        code500Max,
        code502Max,
        code503Max,
        useModuleValDiag,
    } = getDiagConfig();

    const DAList: readonly CAhkFunc[] = getDAListTop(AhkFileData.AST);
    const cache: TDaDiagCache | undefined = wm.get(DAList);
    if (
        cache !== undefined
        && cache.code500Max === code500Max
        && cache.code502Max === code502Max
        && cache.code503Max === code503Max
        && cache.useModuleValDiag === useModuleValDiag
    ) {
        return cache.DADiagList;
    }

    // TODO WTF style
    const code500List: C500Class[] = [];
    const code501List: C501Class[] = [];
    const code502List: C502Class[] = [];
    const code503List: C502Class[] = []; // 502 .eq. 503
    const code504List: C504Class[] = [];
    const code505List: C505Class[] = [];
    const code506List: C506Class[] = [];

    for (const { paramMap, valMap, textMap } of DAList) {
        NeverUsedVar(valMap, code500List, code500Max, displayErrList);
        NeverUsedParam(paramMap, code501List, displayErrList);
        caseSensitivityVar(EPrefixC502.var, valMap, code502List, code502Max, displayErrList); // var case sensitivity
        caseSensitivityVar(EPrefixC502.param, paramMap, code503List, code503Max, displayErrList);
        paramVariadicErr(paramMap, code504List);
        c505ErrParamParsedError(paramMap, code505List);
        C506DiagNumberStyle(textMap, code506List);
        // TODO diag? https://stackoverflow.com/questions/12684985/why-doesnt-autohotkey-support-default-parameters-in-the-middle-of-the-parameter
    }
    if (useModuleValDiag) {
        const { ModuleValMap, ModuleTextMap } = AhkFileData.ModuleVar;
        NeverUsedVar(ModuleValMap, code500List, code500Max, displayErrList);
        caseSensitivityVar(EPrefixC502.var, ModuleValMap, code502List, code502Max, displayErrList);
        C506DiagNumberStyle(ModuleTextMap, code506List);
    }

    const DADiagList: readonly CDiagFn[] = [
        ...code500List,
        ...code501List,
        ...code502List,
        ...code503List,
        ...code504List,
        ...code505List,
        ...code506List,
    ];

    wm.set(DAList, {
        DADiagList,
        code500Max,
        code502Max,
        code503Max,
        useModuleValDiag,
    });
    return DADiagList;
}

export function digDAFile(AhkFileData: TAhkFileData): void {
    const {
        ModuleVar,
        uri,
        DocStrMap,
        AST,
    } = AhkFileData;

    const displayFnErrList: readonly boolean[] = DocStrMap
        .map(({ displayFnErr }: TAhkTokenLine): boolean => displayFnErr);

    diagColl.set(uri, [
        ...(diagColl.get(uri) ?? []).filter((diag: vscode.Diagnostic): boolean => !(diag instanceof CDiagFn)),
        ...diagDAFileCore(AhkFileData, displayFnErrList),
        // It is related to the whole pm, be careful not to use weakmap memory
        ...c511banVarNam(AST, displayFnErrList),
        ...c512banGlobalVarName(ModuleVar.ModuleValMap, displayFnErrList),
        ...c513banLabelName(AST, displayFnErrList),
    ]);
}

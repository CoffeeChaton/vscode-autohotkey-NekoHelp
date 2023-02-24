import type { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import { pm } from '../core/ProjectManager';
import { setBaseDiag } from '../provider/Diagnostic/setBaseDiag';
import { digDAFile } from '../tools/DeepAnalysis/Diag/digDAFile';
import { getDAListTop } from '../tools/DeepAnalysis/getDAList';
import { WordFrequencyStatistics } from './tools/WordFrequencyStatistics';

export function DeepAnalysisAllFiles(): null {
    const t1: number = Date.now();

    const ahkFnList: CAhkFunc[] = [];
    for (const AhkFileData of pm.DocMap.values()) { // keep output order is OK
        ahkFnList.push(...getDAListTop(AhkFileData.AST));
        setBaseDiag(AhkFileData);
        digDAFile(AhkFileData);
    }

    WordFrequencyStatistics(ahkFnList, Date.now() - t1);

    return null;
}

/*
my project:

Problems (Ctrl+Shift+M) - Total 84 Problems

Deep Analysis All Files
Deep Analysis : 745 Symbol, function : 665 , method: 80
paramMapSize is 1926
valMapSize is 2033
textMapSize is 434
All Size is 4393
Done in 9 ms
; +6ms with c511 c512 c513, because not with weakMap cache
*/

import type { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import { pm } from '../core/ProjectManager';
import { digDAFile } from '../provider/Diagnostic/digDAFile';
import { setBaseDiag } from '../provider/Diagnostic/setBaseDiag';
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
Deep Analysis All Files
Deep Analysis : 745 Symbol, function : 665 , method: 80
paramMapSize is 1926
valMapSize is 2034
textMapSize is 361
All Size is 4321
Done in 4 ms
; at v0.0.31 add 2 valMapSize of `oldVar = str str`
*/

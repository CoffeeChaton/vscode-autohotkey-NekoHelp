import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import { EDiagCode } from '../../../../diag';
import { CMemo } from '../../../../tools/CMemo';
import type { TFnMap } from '../../../../tools/visitor/getFileAllFuncMap';
import { getFileAllFuncMap } from '../../../../tools/visitor/getFileAllFuncMap';
import { CDiagBase } from '../CDiagBase';

const code304ErrList: readonly string[] = [
    'Break',
    'Case',
    'Catch',
    'Continue',
    'Critical',
    'Default',
    'Else',
    'Exit',
    'ExitApp',
    'Finally',
    'For',
    'GoSub',
    'Goto',
    // 'If', ahk-v1 [`IF` `While` cannot be defined as a function](https://github.com/AutoHotkey/AutoHotkey/blob/v1.1/source/script.cpp#L1404)
    'IfMsgBox',
    'Loop',
    'Pause',
    'Reload',
    'Return',
    'Switch',
    'Throw',
    'Try',
    'Until',
    // 'While', ahk-v1 [`IF` `While` cannot be defined as a function](https://github.com/AutoHotkey/AutoHotkey/blob/v1.1/source/script.cpp#L1404)
].map((v: string): string => v.toUpperCase());

const code304Err = new CMemo<TAhkFileData, readonly CDiagBase[]>((AhkFileData: TAhkFileData): readonly CDiagBase[] => {
    const {
        AST,
        DocStrMap,
    } = AhkFileData;

    const diagList: CDiagBase[] = [];

    const fnMap: TFnMap = getFileAllFuncMap(AST);
    for (const upKeyWord of code304ErrList) {
        const fnDef: CAhkFunc | undefined = fnMap.get(upKeyWord);
        if (fnDef !== undefined) {
            const { range } = fnDef;
            const { displayErr } = DocStrMap[range.start.line];
            if (displayErr) {
                diagList.push(
                    new CDiagBase({
                        value: EDiagCode.code304,
                        range,
                        severity: vscode.DiagnosticSeverity.Warning,
                        tags: [],
                    }),
                );
            }
        }
    }

    return diagList;
});

export function getCode304Err(AhkFileData: TAhkFileData): readonly CDiagBase[] {
    return code304Err.up(AhkFileData);
}

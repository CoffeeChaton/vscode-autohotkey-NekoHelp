import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import { EDiagCode } from '../../../../diag';
import { CMemo } from '../../../../tools/CMemo';
import type { TFnMap } from '../../../../tools/visitor/getFileAllFuncMap';
import { getFileAllFuncMap } from '../../../../tools/visitor/getFileAllFuncMap';
import { CDiagBase } from '../CDiagBase';

const code601ErrList: readonly string[] = [
    // https://www.autohotkey.com/docs/v1/lib/Hotkey.htm
    // Hotkey, KeyName , Label, Options
    'On',
    'Off',
    'Toggle',
    'AltTab',
    // AltTab (and others): These are special Alt-Tab hotkey actions that are described here.
    // -> https://www.autohotkey.com/docs/v1/Hotkeys.htm#alttab
    'ShiftAltTab',
    'AltTabMenu',
    'AltTabAndMenu',
    'AltTabMenuDismiss',
].map((v: string): string => v.toUpperCase());

const code601Err = new CMemo<TAhkFileData, readonly CDiagBase[]>((AhkFileData: TAhkFileData): readonly CDiagBase[] => {
    const {
        AST,
        DocStrMap,
    } = AhkFileData;

    const diagList: CDiagBase[] = [];

    const fnMap: TFnMap = getFileAllFuncMap(AST);
    for (const upKeyWord of code601ErrList) {
        const fnDef: CAhkFunc | undefined = fnMap.get(upKeyWord);
        if (fnDef !== undefined) {
            const { range } = fnDef;
            const { displayErr } = DocStrMap[range.start.line];
            if (displayErr) {
                diagList.push(
                    new CDiagBase({
                        value: EDiagCode.code601,
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

export function getCode601Err(AhkFileData: TAhkFileData): readonly CDiagBase[] {
    return code601Err.up(AhkFileData);
}

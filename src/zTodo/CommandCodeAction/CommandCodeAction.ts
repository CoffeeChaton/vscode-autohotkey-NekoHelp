/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import { ECommand } from '../../command/ECommand';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import type { TCompletionMsgBoxParam } from './CompletionMsgBox';

function CommandCodeAction(
    AhkFileData: TAhkFileData,
    selection: vscode.Range | vscode.Selection,
): vscode.Command[] {
    if (!(selection instanceof vscode.Selection)) return [];
    const { line, character } = selection.active;

    const AhkTokenLine: TAhkTokenLine = AhkFileData.DocStrMap[line];
    const { fistWordUp, fistWordUpCol } = AhkTokenLine;
    if (
        fistWordUp === 'MSGBOX'
        && character > fistWordUpCol
        && character < fistWordUpCol + fistWordUp.length
    ) {
        return [{
            title: 'add MsgBox Options',
            command: ECommand.CompletionMsgBox,
            tooltip: 'by neko-help',
            arguments: [AhkTokenLine] as TCompletionMsgBoxParam,
        }];
    }

    return [];
}

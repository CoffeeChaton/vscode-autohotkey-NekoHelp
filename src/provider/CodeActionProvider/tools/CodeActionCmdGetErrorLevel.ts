import * as vscode from 'vscode';
import type { CmdCodeActionAddErrorLevelTemplate } from '../../../command/CmdCodeActionAddErrorLevelTemplate';
import { ECommand } from '../../../command/ECommand';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { ErrorLevelMap } from '../../Hover/tools/hoverErrorLevel';

export function CodeActionCmdGetErrorLevel(
    active: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
    AhkFileData: TAhkFileData,
): [vscode.CodeAction] | never[] {
    const {
        fistWordUp,
        line,
        fistWordUpCol,
    } = AhkTokenLine;

    if (fistWordUp === '') return [];
    //
    const e2: string | undefined = ErrorLevelMap.get(fistWordUp);
    if (e2 === undefined) return [];

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, fistWordUpCol),
        new vscode.Position(line, fistWordUpCol + fistWordUp.length),
    );
    if (!range.contains(active)) return [];

    const CA = new vscode.CodeAction('add ErrorLevel Template');
    CA.command = {
        title: 'add ErrorLevel Template', // CmdCodeActionAddErrorLevelTemplate
        command: ECommand.CmdCodeActionAddErrorLevelTemplate,
        tooltip: 'by neko-help',
        arguments: [
            AhkFileData.uri,
            new vscode.Position(line + 1, 0),
            e2,
        ] satisfies Parameters<typeof CmdCodeActionAddErrorLevelTemplate>,
    };
    //
    return [CA];
}

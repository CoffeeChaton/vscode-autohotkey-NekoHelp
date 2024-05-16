import * as vscode from 'vscode';
import { pm } from '../core/ProjectManager';
import { memoFileGuiRef } from '../provider/Def/gotoGuiNameDef';
import type { TGui2ndParamEx } from '../tools/Built-in/7_sub_command/GuiName/GuiName.tools';

export async function CmdCodeActionAddGuiName(editIri: vscode.Uri, position: vscode.Position): Promise<null> {
    const map = new Map<string, vscode.QuickPickItem>();
    for (const AhkFileData of pm.getDocMapValue()) {
        const { uri } = AhkFileData;
        const allRef: readonly TGui2ndParamEx[] = memoFileGuiRef.up(AhkFileData);

        for (const ref of allRef) {
            if (ref.GuiName !== null) {
                map.set(ref.GuiName.wordUp, {
                    label: `${ref.GuiName.rawName}:`,
                    description: uri.fsPath,
                });
            }
        }
    }

    const select: vscode.QuickPickItem | undefined = await vscode.window.showQuickPick<vscode.QuickPickItem>(
        [...map.values()],
        { title: 'Select and add guiName' },
    );
    if (select === undefined) return null;

    const newText: string = select.label;

    const snippet: vscode.SnippetString = new vscode.SnippetString(newText);
    const WorkspaceEdit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    WorkspaceEdit.set(
        editIri,
        [vscode.SnippetTextEdit.insert(position, snippet)],
    );

    await vscode.workspace.applyEdit(WorkspaceEdit);
    return null;
}

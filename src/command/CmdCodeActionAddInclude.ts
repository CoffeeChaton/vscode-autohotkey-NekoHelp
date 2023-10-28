import * as path from 'node:path';
import * as vscode from 'vscode';
import { pm } from '../core/ProjectManager';
import { log } from '../provider/vscWindows/log';

export async function CmdCodeActionAddInclude(uri: vscode.Uri, position: vscode.Position): Promise<undefined> {
    const arr: vscode.QuickPickItem[] = [...pm.DocMap.keys()]
        .filter((v: string): boolean => v !== uri.fsPath)
        // don't normalize !
        .map((label: string): vscode.QuickPickItem => ({ label }));

    const selectPathData: vscode.QuickPickItem | undefined = await vscode.window.showQuickPick<vscode.QuickPickItem>(
        [
            ...arr,
            {
                label: '',
                kind: vscode.QuickPickItemKind.Separator,
            },
            {
                label: 'Q&A',
                description: 'why not use default completion?',
            },
        ],
        { title: 'Select and complete' },
    );
    if (selectPathData === undefined) return undefined;

    const { label } = selectPathData;
    if (label === 'Q&A') {
        await vscode.env.openExternal(
            vscode.Uri.parse('https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/27'),
        );
        return undefined;
    }
    //
    const style: vscode.QuickPickItem | undefined = await vscode.window.showQuickPick<vscode.QuickPickItem>(
        [
            {
                label: path.basename(label),
                description: 'just file name',
            },
            {
                label: `%A_LineFile%\\${path.relative(uri.fsPath, label)}`,
                description: 'relative path (win style)',
            },
            {
                label,
                description: 'absolute path',
            },
        ],
        { title: 'Select complete style' },
    );
    if (style === undefined) return undefined;

    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.insert(
        uri,
        position,
        ` ${style.label}`,
    );

    if (await vscode.workspace.applyEdit(edit)) {
        log.info(`add "#include ${style.label}"`);
    } else {
        log.warn(`add "#include ${style.label}"`);
    }

    return undefined;
}

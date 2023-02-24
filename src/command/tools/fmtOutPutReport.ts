import * as vscode from 'vscode';
import { EFormatChannel } from '../../globalEnum';
import { FormatCore, FormatCoreWrap } from '../../provider/Format/FormatProvider';

export async function fmtOutPutReport(document: vscode.TextDocument): Promise<void> {
    const TextEdit: vscode.TextEdit[] = FormatCoreWrap(FormatCore({
        document,
        options: {
            tabSize: 4,
            insertSpaces: true,
        },
        fmtStart: 0,
        fmtEnd: document.lineCount - 1,
        from: EFormatChannel.byFormatAllFile,
        needDiff: true,
    }));

    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.set(document.uri, TextEdit);
    await vscode.workspace.applyEdit(edit);
}

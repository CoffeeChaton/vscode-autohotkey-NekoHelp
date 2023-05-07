import * as vscode from 'vscode';
import type { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import { wmReturnSign } from '../tools/Func/getFuncAhkDocData';

// --------

export async function CmdFnAddAhkDoc(ahkFn: CAhkFunc): Promise<void> {
    const { uri, paramMap, range } = ahkFn;

    let i = 1;
    const paramTagList: string[] = [];
    for (const { keyRawName } of paramMap.values()) {
        paramTagList.push(`* @param {\${${i}:unknown_type}} ${keyRawName} \${${i + 1}:information}`);
        i += 2;
    }

    const returnVar: string = wmReturnSign.up(ahkFn).trim();
    const returnTag: string = returnVar === ''
        ? ''
        : `* @Return {\${${i}:unknown_type}} ${returnVar} \${${i + 1}:information}`;

    const newText: string = [
        '/**',
        ...paramTagList,
        // @param {unknown_type} param_name information
        returnTag,
        '*/',
        '',
    ].join('\n');

    const snippet: vscode.SnippetString = new vscode.SnippetString(newText);
    const WorkspaceEdit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    WorkspaceEdit.set(
        uri,
        [vscode.SnippetTextEdit.insert(range.start, snippet)],
    );

    await vscode.workspace.applyEdit(WorkspaceEdit);
}

// 'executeReferenceProvider'

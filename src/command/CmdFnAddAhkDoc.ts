import * as vscode from 'vscode';
import type { CAhkFunc } from '../AhkSymbol/CAhkFunc';

function getReturnSelect(ahkFn: CAhkFunc, i: number): string {
    const arr1: string[] = [];
    for (const s of ahkFn.meta.returnList) {
        const s1: string = s
            .replace(/^\s*return\s*/iu, '')
            .replace(/[ \t]*;.*/u, '')
            .trim();

        if (s1 !== '') arr1.push(s1);
    }

    return arr1.length === 0
        ? ''
        : `* @returns {\${${i}:unknown_type}} \${${i + 1}|${arr1.join(',')}|} \${${i + 2}:information}`;
}
// --------

export async function CmdFnAddAhkDoc(ahkFn: CAhkFunc): Promise<void> {
    const { uri, paramMap, range } = ahkFn;

    let i = 1;
    const paramTagList: string[] = [];
    for (const { keyRawName } of paramMap.values()) {
        paramTagList.push(`* @param {\${${i}:unknown_type}} ${keyRawName} \${${i + 1}:information}`);
        i += 2;
    }

    const newText: string = [
        '/**',
        ...paramTagList,
        // @param {unknown_type} param_name information
        getReturnSelect(ahkFn, i),
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

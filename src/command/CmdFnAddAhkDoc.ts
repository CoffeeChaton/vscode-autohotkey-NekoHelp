import * as vscode from 'vscode';
import type { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import { EParamDefaultType } from '../AhkSymbol/CAhkFunc';

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

function tryCalcType(defaultType: EParamDefaultType): 'boolean' | 'number' | 'string' | 'unknown_type' {
    // number
    // string
    // boolean
    if (defaultType === EParamDefaultType.string) return 'string';
    if (defaultType === EParamDefaultType.boolean) return 'boolean';
    if (defaultType === EParamDefaultType.number) return 'number';
    return 'unknown_type';
}

export async function CmdFnAddAhkDoc(ahkFn: CAhkFunc): Promise<void> {
    const { uri, paramMap, range } = ahkFn;

    let i = 1;
    const paramTagList: string[] = [];
    for (const { keyRawName, defaultValue, defaultType } of paramMap.values()) {
        if (defaultType === EParamDefaultType.nothing) {
            paramTagList.push(`* @param {\${${i}:unknown_type}} ${keyRawName} \${${i + 1}:information}`);
        } else {
            const mayBeType = tryCalcType(defaultType);
            paramTagList.push(`* @param {\${${i}:${mayBeType}}?} ${keyRawName} \${${i + 1}::= ${defaultValue}}`);
        }

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

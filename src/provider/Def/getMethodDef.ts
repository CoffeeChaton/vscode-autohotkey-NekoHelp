import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';
import { getFileAllMethod } from '../../tools/DeepAnalysis/getDAList';
import { ToUpCase } from '../../tools/str/ToUpCase';

export function getMethodDef(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        position,
        /(?<=\.)[#$@\w\u{A1}-\u{FFFF}]+(?=\()/u,
        //            .Name(
    );
    if (range === undefined) return null;
    const wordUp: string = ToUpCase(document.getText(range));

    const list: vscode.Location[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const { AST } = AhkFileData;
        const method: CAhkFunc | undefined = getFileAllMethod(AST).get(wordUp);
        if (method !== undefined) {
            list.push(new vscode.Location(method.uri, method.selectionRange));
        }
    }

    return list;
}

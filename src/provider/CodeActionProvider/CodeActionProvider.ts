import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { Diags, DiagsDA, EDiagCodeDA } from '../../diag';
import { EDiagBase } from '../../Enum/EDiagBase';
import { isAhk } from '../../tools/fsTools/isAhk';
import { CDiagBase } from '../Diagnostic/tools/CDiagBase';
import { CDiagFn } from '../Diagnostic/tools/CDiagFn';
import { C502Class } from '../Diagnostic/tools/CDiagFnLib/C502Class';
import { C506Class } from '../Diagnostic/tools/CDiagFnLib/C506Class';
import { otherCodeAction } from './otherCodeAction';
import { c501ignoreArgNeverUsed } from './tools/c501ignoreArgNeverUsed';
import { c502c503CodeAction } from './tools/c502c503CodeAction';
import { c506CodeAction } from './tools/c506CodeAction';

type TEditNeed = {
    uri: vscode.Uri,
    ignoreLine: 1 | 2,
    Position: vscode.Position,
};

function getEditNeed(AhkFileData: TAhkFileData, line: number): TEditNeed {
    const { uri, DocStrMap } = AhkFileData;
    if (line === 0) {
        return {
            uri,
            ignoreLine: 1,
            Position: new vscode.Position(line, 0),
        };
    }

    const text: string | undefined = DocStrMap.at(line - 1)?.textRaw;
    if (text !== undefined && (/^\s*\*\//u).test(text)) {
        return {
            uri,
            ignoreLine: 2,
            Position: new vscode.Position(line - 1, 0),
        };
    }
    return {
        uri,
        ignoreLine: 1,
        Position: new vscode.Position(line, 0),
    };
}

function setIgnore(diag: CDiagBase, editNeed: TEditNeed): vscode.CodeAction {
    const { uri, ignoreLine, Position } = editNeed;
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    const { path } = Diags[diag.code.value];
    edit.insert(
        uri,
        Position,
        `${EDiagBase.ignore} ${ignoreLine} line; at ${(new Date()).toLocaleString()} ; ${path}\n`,
    );

    const CA: vscode.CodeAction = new vscode.CodeAction('ignore line');
    CA.kind = vscode.CodeActionKind.QuickFix;
    CA.edit = edit;

    return CA;
}

function setIgnoreDA(diag: CDiagFn, editNeed: TEditNeed): vscode.CodeAction[] {
    const { uri, ignoreLine, Position } = editNeed;
    const { code, range } = diag;
    const { value } = code;

    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.insert(
        uri,
        Position,
        `${EDiagBase.ignoreFn} ${ignoreLine} line; at ${(new Date()).toLocaleString()} ; ${DiagsDA[value].msg}\n`,
    );

    const CA: vscode.CodeAction = new vscode.CodeAction('ignore line');
    CA.kind = vscode.CodeActionKind.QuickFix;
    CA.edit = edit;

    if (value === EDiagCodeDA.code501) return [CA, c501ignoreArgNeverUsed(uri, range.start)];
    if (diag instanceof C502Class) return [CA, ...c502c503CodeAction(uri, diag)];
    if (diag instanceof C506Class) return [CA, ...c506CodeAction(uri, diag)];

    return [CA];
}

function fixDiag(AhkFileData: TAhkFileData, diagnostics: readonly vscode.Diagnostic[]): vscode.CodeAction[] {
    if (!isAhk(AhkFileData.uri.fsPath)) return [];

    const CAList: vscode.CodeAction[] = [];
    for (const diag of diagnostics) {
        if (diag instanceof CDiagBase) {
            CAList.push(setIgnore(diag, getEditNeed(AhkFileData, diag.range.start.line)));
        } else if (diag instanceof CDiagFn) {
            CAList.push(...setIgnoreDA(diag, getEditNeed(AhkFileData, diag.range.start.line)));
        }
    }

    return CAList;
}

export const CodeActionProvider: vscode.CodeActionProvider = {
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.CodeAction[]> {
        const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
        if (AhkFileData === null) return [];

        return [
            ...fixDiag(AhkFileData, context.diagnostics),
            ...otherCodeAction(AhkFileData, range, document),
        ];
    },
};

import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { getMethodConfig } from '../../../configUI';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { getMethodRef2Def } from '../../../tools/Method/Method';

function method2Md(methodList: readonly CAhkFunc[]): vscode.MarkdownString {
    const md = new vscode.MarkdownString();

    for (const method of methodList) {
        md.appendMarkdown(method.md.value)
            .appendMarkdown('\n\n***\n\n');
    }

    return md;
}

export function hoverMethod(
    document: vscode.TextDocument,
    position: vscode.Position,
    AhkFileData: TAhkFileData,
): vscode.MarkdownString | null {
    const methodList: readonly CAhkFunc[] | null = getMethodRef2Def(
        document,
        position,
        AhkFileData,
        getMethodConfig().hover,
    );

    return methodList === null
        ? null
        : method2Md(methodList);
}

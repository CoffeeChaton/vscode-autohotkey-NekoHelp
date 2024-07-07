import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { getConfig } from '../../../configUI';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { Class_meta_method_MDMap } from '../../../tools/Built-in/8_built_in_method_property/class_meta_method.tools';
import { getMethodRef2Def } from '../../../tools/Method/Method';

function method2Md(methodList: readonly CAhkFunc[]): vscode.MarkdownString {
    const mdAll = new vscode.MarkdownString();

    for (const method of methodList) {
        const { md, upName } = method;
        mdAll.appendMarkdown(md.value)
            .appendMarkdown('\n\n***\n\n');

        const __md: vscode.MarkdownString | undefined = Class_meta_method_MDMap.get(upName);
        if (__md !== undefined) {
            mdAll.appendMarkdown(__md.value);
        }
    }

    return mdAll;
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
        getConfig().method.hover,
    );

    return methodList === null
        ? null
        : method2Md(methodList);
}

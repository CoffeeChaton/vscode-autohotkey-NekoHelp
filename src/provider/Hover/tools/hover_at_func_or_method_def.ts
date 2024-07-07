import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { Class_meta_method_MDMap } from '../../../tools/Built-in/8_built_in_method_property/class_meta_method.tools';

export function hover_at_func_or_method_def(
    position: vscode.Position,
    DA: CAhkFunc | null,
): vscode.MarkdownString | null {
    if (DA === null || !DA.nameRange.contains(position)) return null;

    if (DA.kind === vscode.SymbolKind.Function) {
        return DA.md; // hover at func-def-range
    }

    const __md: vscode.MarkdownString | undefined = Class_meta_method_MDMap.get(DA.upName);
    if (__md === undefined) {
        return DA.md; // not hove like __call() __new() ...etc
    }

    return new vscode.MarkdownString(DA.md.value)
        .appendMarkdown('\n---\n')
        .appendMarkdown(__md.value);
}

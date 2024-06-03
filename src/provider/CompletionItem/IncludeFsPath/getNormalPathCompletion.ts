import * as path from 'node:path';
import type * as vscode from 'vscode';
import { EInclude, getRawData } from '../../../AhkSymbol/CAhkInclude';
import { EDetail, type TAhkTokenLine } from '../../../globalEnum';
import { CompletionAbsolutePath } from './IncludeFsPath';

export function getNormalPathCompletion(
    uri: vscode.Uri,
    position: vscode.Position,
    AhkTokenLine: TAhkTokenLine,
    context: vscode.CompletionContext,
): vscode.CompletionItem[] {
    if (!(context.triggerCharacter === '\\' || context.triggerCharacter === '/')) {
        return [];
    }
    const { textRaw, detail } = AhkTokenLine;

    const path0: string = textRaw
        .slice(0, position.character)
        .replace(/[ \t]+;.*$/u, '')
        .trim();

    if (!detail.includes(EDetail.inSkipSign2)) {
        return [];
    }

    const path1: string = detail.includes(EDetail.inSkipSign2)
        ? path0.replaceAll(/%A_Tab%/giu, '\t')
            .replaceAll(/%A_Space%/giu, ' ')
            .replace(/^.*=\s*/u, '')
        : path0 // TODO ...
            .replaceAll(/\bA_Tab\b/giu, '\t')
            .replaceAll(/\bA_Space\b/giu, ' ')
            .replace(/^.*:=\s*"/u, '');
    const { type, mayPath } = getRawData(path1, uri.fsPath);

    // console.log('🚀 ~ path1:', path1);
    // console.log('🚀 ~ document.uri.fsPath:', uri.fsPath);
    // console.log('🚀 ~ mayPath:', mayPath, type);

    if (type === EInclude.isUnknown) {
        return [];
    }

    // if (type === EInclude.Absolute || type === EInclude.A_LineFile) {
    return CompletionAbsolutePath(path.normalize(mayPath), false);
}

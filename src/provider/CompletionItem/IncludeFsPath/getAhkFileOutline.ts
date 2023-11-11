import * as path from 'node:path';
import * as vscode from 'vscode';
import { pm, type TAhkFileData } from '../../../core/ProjectManager';
import type { TTokenStream } from '../../../globalEnum';
import { CMemo } from '../../../tools/CMemo';
import { getFileAllClass } from '../../../tools/visitor/getFileAllClassList';
import { getFileAllFunc } from '../../../tools/visitor/getFileAllFuncList';

function makeFileOutline(list: readonly vscode.DocumentSymbol[]): string[] {
    if (list.length === 0) return [];
    return list
        .map((v: vscode.DocumentSymbol): string => v.name);
}

function getFirstAhkDoc(DocStrMap: TTokenStream): string {
    const { length } = DocStrMap;
    for (let i = 0; i < length; i++) {
        const { ahkDoc } = DocStrMap[i];
        if (ahkDoc !== '') { // find first
            const i2 = i + 1;

            if (i2 < length) {
                const { lStr } = DocStrMap[i2];
                if (lStr.trim() === '') {
                    return ahkDoc;
                }
            }
            return ''; // first ahk-doc next line has some data...
        }
    }

    return '';
}

const memoAhkFileOutline = new CMemo<TAhkFileData, vscode.MarkdownString>(
    (AhkFileData: TAhkFileData): vscode.MarkdownString => {
        const {
            uri,
            AST,
            DocStrMap,
        } = AhkFileData;
        const arr: string[] = [
            path.normalize(uri.fsPath),
            '',
            getFirstAhkDoc(DocStrMap),
            '',
        ];

        const classList: string[] = makeFileOutline(getFileAllClass(AST));
        if (classList.length > 0) {
            arr.push(
                '',
                '- class',
                '',
                '```ahk',
                ...classList.map((v: string) => `class ${v}`),
                '```',
                '',
                '',
            );
        }

        const fnList: string[] = makeFileOutline(getFileAllFunc.up(AST));
        if (fnList.length > 0) {
            arr.push(
                '',
                '- function',
                '',
                '```ahk',
                ...fnList.map((v: string) => `${v}()`),
                '```',
                '',
                '',
            );
        }

        return new vscode.MarkdownString(arr.join('\n'), true);
    },
);

export function getAhkFileOutline(
    normalize: string,
): vscode.MarkdownString {
    const { fsPath } = vscode.Uri.file(normalize);

    /**
     * TODO add config of up this file ?
     */
    const AhkFileData: TAhkFileData | undefined = pm.DocMap.get(fsPath);
    if (AhkFileData === undefined) return new vscode.MarkdownString(`${normalize}\n\nunopened files`);

    return memoAhkFileOutline.up(AhkFileData);
}

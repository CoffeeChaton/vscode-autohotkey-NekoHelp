import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { EInclude, getRawData } from '../../../AhkSymbol/CAhkInclude';
import { type TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { isAhk } from '../../../tools/fsTools/isAhk';
import { log } from '../../vscWindows/log';
import { getAhkFileOutline } from './getAhkFileOutline';

function CompletionAbsolutePathLogErr(error: unknown): void {
    if (error instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const message: string = error.message ?? '';
        if (
            // access
            message.startsWith('EPERM: operation not permitted')
            || message.startsWith('EBUSY: resource busy or locked')
        ) {
            //
        } else {
            log.warn('--56--21--unknown--error', error);
        }
    }
}

function CompletionAbsolutePath(
    mayPath: string,
): vscode.CompletionItem[] {
    // folders before files
    // sort a b
    const FolderList: vscode.CompletionItem[] = [];
    const FileList: vscode.CompletionItem[] = [];

    if (!fs.existsSync(mayPath)) return [];

    const StatsFather: fs.Stats = fs.statSync(mayPath);
    if (!StatsFather.isDirectory()) return [];

    const mayPathFix: string = mayPath.replaceAll('\\', '/');
    for (const file of fs.readdirSync(mayPath)) {
        try {
            const normalize: string = path.normalize(`${mayPathFix}/${file}`);
            const Stats: fs.Stats = fs.statSync(normalize);
            if (Stats.isDirectory()) {
                const item: vscode.CompletionItem = new vscode.CompletionItem(file, vscode.CompletionItemKind.Folder);
                item.detail = 'neko help; (#include Folder)';
                item.documentation = normalize;
                item.sortText = `a${file}`;
                FolderList.push(item);
            } else if (isAhk(file)) {
                const item: vscode.CompletionItem = new vscode.CompletionItem(file, vscode.CompletionItemKind.File);
                item.detail = 'neko help; (#include File)';
                if (isAhk(normalize)) {
                    item.documentation = getAhkFileOutline(normalize);
                }
                item.sortText = `b${file}`;
                FileList.push(item);
            }
        } catch (error: unknown) {
            CompletionAbsolutePathLogErr(error);
        }
    }

    return [
        ...FolderList,
        ...FileList,
    ];
}

export function IncludeFsPath(
    document: vscode.TextDocument,
    position: vscode.Position,
    AhkFileData: TAhkFileData,
    AhkTokenLine: TAhkTokenLine,
): vscode.CompletionItem[] {
    const { textRaw } = AhkTokenLine;

    const path1: string = textRaw
        .slice(0, position.character)
        .replace(/^\s*#include(?:Again)?\s+/iu, '')
        .replace(/^\*i\s+/iu, '')
        .trim();

    const tryRemoveComment: string = path1.replace(/[ \t];.*$/u, '')
        .trim()
        .replaceAll(/%A_Tab%/giu, '\t')
        .replaceAll(/%A_Space%/giu, ' ');

    const { type, mayPath } = getRawData(tryRemoveComment, document.uri.fsPath);
    if (type === EInclude.isUnknown) {
        return [];
    }

    // if (type === EInclude.Absolute || type === EInclude.A_LineFile) {
    return CompletionAbsolutePath(path.normalize(mayPath));
}

/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'node:fs';
import * as vscode from 'vscode';
import { getIgnoredList } from '../../configUI';
import { getWorkspaceRoot } from './getWorkspaceRoot';
import { isAhk } from './isAhk';

type TFsPath = string;

export function fsPathIsAllow(fsPath: string, blockList: readonly RegExp[]): boolean {
    return !blockList.some((reg: RegExp) => reg.test(fsPath));
}

function CollectorFsPath(fsPath: TFsPath, blockList: readonly RegExp[], Collector: Set<TFsPath>): void {
    const Stats: fs.Stats = fs.statSync(fsPath);
    if (Stats.isDirectory()) {
        const files: string[] = fs.readdirSync(fsPath);
        for (const file of files) {
            const fsPathNext: TFsPath = `${fsPath}/${file}`;
            if (fsPathIsAllow(fsPathNext, blockList)) {
                CollectorFsPath(fsPathNext, blockList, Collector);
            }
        }
    } else if (Stats.isFile() && isAhk(fsPath)) {
        Collector.add(fsPath);
    }
}

export function getUriList(): vscode.Uri[] {
    const WorkspaceFolderList: readonly vscode.Uri[] = getWorkspaceRoot();
    if (WorkspaceFolderList.length === 0) return [];

    const blockList: readonly RegExp[] = getIgnoredList();
    const Collector: Set<TFsPath> = new Set<TFsPath>();

    for (const uri of WorkspaceFolderList) {
        const rootFsPath: string = uri.fsPath.replaceAll('\\', '/');
        CollectorFsPath(rootFsPath, blockList, Collector);
    }

    return [...Collector].map((path0: string): vscode.Uri => vscode.Uri.file(path0));
}

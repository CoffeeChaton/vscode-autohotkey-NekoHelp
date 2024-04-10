import * as fs from 'node:fs';
import * as vscode from 'vscode';
import { getIgnoredList } from '../../configUI';
import { isAhk } from './isAhk';

export function fsPathIsAllow(fsPath: string, blockList: readonly RegExp[]): boolean {
    return !blockList.some((reg: RegExp) => reg.test(fsPath));
}

function CollectorFsPath(
    fsPath: string,
    blockList: readonly RegExp[],
    Collector: Set<string>,
    record: Set<string>,
): void {
    if ((/\.asar$/iu).test(fsPath)) return;

    const Stats: fs.Stats = fs.statSync(fsPath);
    if (Stats.isDirectory()) {
        const files: string[] = fs.readdirSync(fsPath);
        for (const file of files) {
            const fsPathNext = `${fsPath}/${file}`;

            if (!record.has(fsPathNext)) {
                record.add(fsPathNext);
                if (fsPathIsAllow(fsPathNext, blockList)) {
                    CollectorFsPath(fsPathNext, blockList, Collector, record);
                }
            }
        }
    } else if (Stats.isFile() && isAhk(fsPath)) {
        Collector.add(fsPath);
    }
}

/**
 * @param WorkspaceFolderList = [...getWorkspaceRoot(), ...getAlwaysIncludeFolder()].sort()
 * @returns
 */
export function getUriList(WorkspaceFolderList: readonly string[]): vscode.Uri[] {
    if (WorkspaceFolderList.length === 0) return [];

    const blockList: readonly RegExp[] = getIgnoredList();
    const Collector: Set<string> = new Set<string>();
    const record: Set<string> = new Set<string>();

    for (const fsPath of WorkspaceFolderList) {
        const rootFsPath: string = fsPath.replaceAll('\\', '/');
        CollectorFsPath(rootFsPath, blockList, Collector, record);
    }

    return [...Collector].map((path0: string): vscode.Uri => vscode.Uri.file(path0));
}

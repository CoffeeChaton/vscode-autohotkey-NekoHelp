import path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkInclude, TRawData } from '../AhkSymbol/CAhkInclude';
import { EInclude } from '../AhkSymbol/CAhkInclude';
import { pm } from '../core/ProjectManager';
import { enumLog } from '../tools/enumErr';
import { collectInclude } from './ListAllInclude';
import { diagOfIncludeTree } from './tools/diagOfIncludeTree';

type TIncludeMap = Map<string, CAhkInclude[]>;

function getIncludeMap(): TIncludeMap {
    const map: Map<string, CAhkInclude[]> = new Map<string, CAhkInclude[]>();
    for (const [fsPath, AhkFileData] of pm.DocMap) { // keep output order
        const list: CAhkInclude[] = collectInclude(AhkFileData.AST);

        if (list.length > 0) {
            map.set(fsPath, list);
        }
    }
    return map;
}

function getSearchPath(docPath: string, { type, mayPath }: TRawData): string {
    switch (type) {
        case EInclude.A_LineFile:
        case EInclude.Absolute:
        case EInclude.Relative:
            return mayPath;

        case EInclude.isUnknown:
            return path.join(path.dirname(docPath), mayPath);

        case EInclude.Lib:
            return path.join(path.dirname(docPath), 'Lib', `${mayPath}.ahk`);

        default:
            enumLog(type, 'getSearchPath');
            return '';
    }
}

export type TTreeResult = {
    deep: number,
    name: string,
    hasFile: boolean,
    searchPath: string,
    startPos: string,
};

function IncludeTree(docPath: string, searchStack: string[], IncludeMap: TIncludeMap): TTreeResult[] {
    const deep: number = searchStack.length + 1;

    const list: CAhkInclude[] | undefined = IncludeMap.get(docPath);
    if (list === undefined) return [];

    const result: TTreeResult[] = [];

    for (const { name, rawData, range } of list) {
        const searchPath: string = getSearchPath(docPath, rawData);

        // [docPath, range.start.line + 1, range.start.character + 1];
        const startPos = `${docPath}:${range.start.line + 1}:${range.start.character + 1}`;
        const hasFile: boolean = pm.DocMap.has(searchPath);

        if (hasFile) {
            result.push({
                deep,
                name,
                hasFile,
                searchPath,
                startPos,
            }, ...IncludeTree(searchPath, [...searchStack, searchPath], IncludeMap));
        } else {
            const { warnMsg } = rawData;
            const showMsg = warnMsg === ''
                ? 'can not resolve path'
                : warnMsg;

            result.push({
                deep,
                name,
                hasFile: false,
                searchPath: showMsg,
                startPos,
            });
        }
    }

    return result;
}

function treeResult2StrList(result: TTreeResult[]): string[] {
    //     const space: string = '    '.repeat(deep);

    const msg: string[] = [];
    // eslint-disable-next-line no-magic-numbers
    const max = Math.max(...result.map((v: TTreeResult): number => v.deep * 4 + v.name.length));

    for (
        const {
            deep,
            name,
            hasFile,
            searchPath,
        } of result
    ) {
        const hasFileStr = hasFile
            ? 'OK'
            : 'NG';

        const space: string = '    '.repeat(deep);
        const head = `${space}${name}`.padEnd(max);
        msg.push(`${head}    |${hasFileStr}|    ${searchPath}`);
    }
    return msg;
}

type TPick2 = {
    label: string,
    fsPath: string,
};

function getTPickList(map: TIncludeMap): readonly TPick2[] {
    const items: TPick2[] = [];
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    for (const [i, fsPath] of [...map.keys()].sort().entries()) { // entries() is need i
        items.push({ label: `${i} -> ${fsPath}`, fsPath });
    }
    return items;
}

export async function ListIncludeTree(): Promise<null> {
    const map: TIncludeMap = getIncludeMap();
    const selectPath: TPick2 | undefined = await vscode.window.showQuickPick<TPick2>(getTPickList(map), {
        title: 'Select project entry, just support ahk_L v1',
    });
    if (selectPath === undefined) return null;

    const t1: number = Date.now();

    const result: TTreeResult[] = IncludeTree(selectPath.fsPath, [], map);
    const diagList: string[] = diagOfIncludeTree(result, selectPath.fsPath);

    void vscode.workspace.openTextDocument({
        language: 'ahk',
        content: [
            'this is not ahk, just Report',
            ';> "List All #Include Tree"',
            '',
            `;${selectPath.fsPath}`,
            ...treeResult2StrList(result),
            '',
            ...diagList,
            `Done: ${Date.now() - t1} ms`,
        ].join('\r\n'),
    }).then((doc: vscode.TextDocument): Thenable<vscode.TextEditor> => vscode.window.showTextDocument(doc));

    return null;
}

/* eslint-disable max-lines-per-function */
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }] */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { version } from '../../../package.json';
import type { TAhkFileData } from '../../core/ProjectManager';
import { fileFuncRef } from '../../provider/Def/getFnRef';
import { log } from '../../provider/vscWindows/log';
import { getWorkspaceRoot } from '../../tools/fsTools/getWorkspaceRoot';
import { mkDirByPathSync } from '../../tools/fsTools/mkDirByPathSync';
import { UpdateCacheAsync } from '../UpdateCache';

function generateSnapshot(AhkFileDataList: readonly TAhkFileData[], rootList: readonly string[]): readonly string[] {
    const snapList: string[] = [];
    for (const AhkFileData of AhkFileDataList) {
        const {
            uri,
            DocStrMap,
            AST,
            ModuleVar,
            GValMap,
            ms,
        } = AhkFileData;
        const { fsPath } = uri;

        const { dir, base } = path.parse(fsPath);
        const selectRT: string = rootList.find((rt: string): boolean => dir.startsWith(rt)) ?? rootList[0];

        const targetDir: string = path.normalize(path.join(
            selectRT,
            '.ahk-neko-snapshot',
            path.relative(selectRT, dir),
        ));

        const ms_min = 10;
        const msFix: number = ms <= ms_min
            ? ms_min
            : ms;
        mkDirByPathSync(targetDir);

        const data: string = [
            '# snap',
            '',
            `1. jump <file:${fsPath}>`,
            `2. neko-help-version : \`${version}\``,
            `3. parser use : \`${msFix}\` ms (min 10ms to Reduce diff interference)`,
            '4. Important reminder: Please be advised that **the snapshot files contain the source code for your project.** This means that any sensitive or confidential information within your code may also be included in the snapshot. Therefore, we strongly advise against uploading the snapshot to the report-bug feature or any other public forum. If you need to report a bug that involves a neko-help, we recommend reviewing the contents of the file carefully to ensure that no sensitive information is disclosed before uploading it. Thank you for your cooperation in maintaining the security and confidentiality of your code.',
            '',
            '- [snap](#snap)',
            `  - [lineMsg](#${'lineMsg'.toLowerCase()})`,
            '  - [symbol tree](#symbol-tree)',
            `  - [ModuleVar](#${'ModuleVar'.toLowerCase()})`,
            `  - [GValMap](#${'GValMap'.toLowerCase()})`,
            '',
            '## lineMsg',
            '',
            '```jsonc',
            JSON.stringify(DocStrMap, null, 4),
            '```',
            '',
            '## symbol tree',
            '',
            '```jsonc',
            JSON.stringify(AST, (key: string, value: unknown): unknown => {
                if (value instanceof Map) {
                    return Object.fromEntries(value) as unknown;
                }
                if (key === 'AssociatedList' && Array.isArray(value) && value.length === 0) {
                    return undefined;
                }
                return value;
            }, 4),
            '```',
            '',
            '## ModuleVar',
            '',
            '```jsonc',
            JSON.stringify(ModuleVar, (key: string, value: unknown): unknown => {
                if (value instanceof Map) {
                    return Object.fromEntries(value) as unknown;
                }
                if (key === 'AssociatedList' && Array.isArray(value) && value.length === 0) {
                    return undefined;
                }
                return value;
            }, 4),
            '```',
            '',
            '## GValMap',
            '',
            '```jsonc',
            JSON.stringify(GValMap, (key: string, value: unknown): unknown => {
                if (value instanceof Map) {
                    return Object.fromEntries(value) as unknown;
                }
                return value;
            }, 4),
            '```',
            '',
            '## func-ref',
            '',
            '```jsonc',
            JSON.stringify(fileFuncRef.up(AhkFileData), (key: string, value: unknown): unknown => {
                if (value instanceof Map) {
                    return Object.fromEntries(value) as unknown;
                }
                return value;
            }, 4),
            '```',
            '',
        ].join('\r\n');

        const mdPath: string = path.join(targetDir, `${base}.md`);
        snapList.push(mdPath);
        fs.writeFileSync(mdPath, data);
    }

    return snapList;
}

export async function generateAhkNekoSnapshot(): Promise<void> {
    type TPick0 = {
        label: string,
        isAllow: boolean,
    };

    const allowWrite: TPick0 | undefined = await vscode.window.showQuickPick<TPick0>([
        { label: '0 -> Cancel ', isAllow: false },
        { label: '1 -> Allow creating snapshot files in the folder for debugging purposes.', isAllow: true },
    ], {
        title:
            'Caution: This operation will generate numerous irrelevant files in the workspace. It is not recommended to proceed unless you are certain about debugging.',
    });

    if (allowWrite === undefined || !allowWrite.isAllow) {
        return;
    }

    const t1: number = Date.now();
    const rootList: readonly string[] = getWorkspaceRoot();
    if (rootList.length === 0) {
        void vscode.window.showInformationMessage(
            'This feature is temporarily limited to cases that have an open workspace.',
        );
        return;
    }

    const AhkFileDataList: readonly TAhkFileData[] = await UpdateCacheAsync(false);
    const snapList: readonly string[] = generateSnapshot(AhkFileDataList, rootList)
        .map((fsPath: string, i: number): string => `${i} -> '${fsPath.replaceAll('\\', '/')}'`);

    log.info(
        'snapshot created at',
        JSON.stringify(snapList, null, 4),
        `Done : ${Date.now() - t1} ms`,
    );
    log.show();
}

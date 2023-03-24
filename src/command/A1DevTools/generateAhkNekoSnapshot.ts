/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }] */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { version } from '../../../package.json';
import type { TAhkFileData } from '../../core/ProjectManager';
import { log } from '../../provider/vscWindows/log';
import { getWorkspaceRoot } from '../../tools/fsTools/getWorkspaceRoot';
import { UpdateCacheAsync } from '../UpdateCache';
import { mkDirByPathSync } from './mkDirByPathSync';

function generateSnapshot(AhkFileDataList: readonly TAhkFileData[], rootList: readonly string[]): void {
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
        const selectRT: string = rootList.find((rt: string): boolean => fsPath.startsWith(rt))
            ?? rootList[0];

        const basename: string = path.basename(fsPath);
        const a: string = fsPath
            .slice(0, fsPath.length - basename.length);
        const b: string = a.replace(selectRT, '');
        const targetDir: string = path.join(
            selectRT,
            '.ahk-neko-snapshot',
            b,
        );
        mkDirByPathSync(targetDir);

        const data: string = [
            '# snap',
            '',
            `1. jump <file:${fsPath}>`,
            `2. neko-help-version : \`${version}\``,
            `3. parser use : \`${ms}\` ms`,
            '',
            '- [snap](#snap)',
            `  - [lineMsg](#${'lineMsg'.toLowerCase()})`,
            '  - [AST](#ast)',
            `  - [ModuleVar](#${'ModuleVar'.toLowerCase()})`,
            `  - [GValMap](#${'GValMap'.toLowerCase()})`,
            '',
            '## lineMsg',
            '',
            '```jsonc',
            JSON.stringify(DocStrMap, null, 4),
            '```',
            '',
            '## AST',
            '',
            '```jsonc',
            JSON.stringify(AST, (key: string, value: unknown): unknown => {
                if (value instanceof Map) {
                    return Object.fromEntries(value) as unknown;
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
                return value;
            }, 4),

            // JSON.stringify(ModuleVar, null, space),
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
        ].join('\r\n');
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.writeFileSync(path.join(targetDir, `${basename}.md`), data);
    }
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

    const rootList: readonly string[] = getWorkspaceRoot().map((uri: vscode.Uri): string => uri.fsPath);
    if (rootList.length === 0) {
        void vscode.window.showInformationMessage(
            'This feature is temporarily limited to cases that have an open workspace.',
        );
        return;
    }

    const AhkFileDataList: readonly TAhkFileData[] = await UpdateCacheAsync(false);
    generateSnapshot(AhkFileDataList, rootList);

    log.info(
        'snapshot created at',
        JSON.stringify(
            rootList.map((v: string): string => (path.join(
                v,
                '.ahk-neko-snapshot',
            ))),
            null,
            4,
        ),
    );
    log.show();
}

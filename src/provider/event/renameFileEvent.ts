import * as vscode from 'vscode';
import { EInclude } from '../../AhkSymbol/CAhkInclude';
import { collectInclude } from '../../command/tools/collectInclude';
import type { TAhkFileData } from '../../core/ProjectManager';

export type TIncludeMap = {
    name: string,
    uriFsPath: string,
};

export function getFileMap(AhkFileDataList: TAhkFileData[]): readonly TIncludeMap[] {
    // include -> range -> mayPath
    const includeMapList: TIncludeMap[] = [];
    for (const { AST } of AhkFileDataList) {
        for (const ahkInclude of collectInclude(AST)) {
            const {
                rawData,
                name,
            } = ahkInclude;
            const { mayPath, type } = rawData;

            const uriFsPath: string = ((): string => {
                if (type === EInclude.isUnknown) return '';

                try {
                    return vscode.Uri.file(mayPath).fsPath;
                } catch {
                    return '';
                }
            })();
            includeMapList.push({
                name,
                uriFsPath,
            });
        }
    }
    return includeMapList;
}

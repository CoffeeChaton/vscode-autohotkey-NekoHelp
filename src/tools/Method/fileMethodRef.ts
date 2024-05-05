import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { CMemo } from '../CMemo';
import { ToUpCase } from '../str/ToUpCase';

// weakMap -> this
export type TMethodRef = {
    rawName: string,
    upName: string,
    range: vscode.Range,
};

type TMethodDefShell = ReadonlyMap<string, readonly TMethodRef[]>;

export const fileMethodRef = new CMemo<TAhkFileData, TMethodDefShell>((AhkFileData: TAhkFileData): TMethodDefShell => {
    const { DocStrMap } = AhkFileData;
    const map = new Map<string, TMethodRef[]>();
    //
    for (const AhkTokenLine of DocStrMap) {
        const { line, lStr } = AhkTokenLine;
        for (const ma of lStr.matchAll(/(?<=\.)([#$@\w\u{A1}-\u{FFFF}]+)(?=\()/giu)) {
            //                                        .Name(
            const col: number = ma.index;

            const rawName: string = ma[1];
            const upName: string = ToUpCase(rawName);
            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, col),
                new vscode.Position(line, col + rawName.length),
            );

            const arr: TMethodRef[] = map.get(upName) ?? [];
            arr.push({
                rawName,
                upName,
                range,
            });
            map.set(upName, arr);
        }
    }

    return map;
});

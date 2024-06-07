import * as vscode from 'vscode';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { CMemo } from '../../../CMemo';
import type { TScanData } from '../../../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../../../DeepAnalysis/FnVar/def/spiltCommandAll';
import { ToUpCase } from '../../../str/ToUpCase';

export type TMenuParam1stData = {
    rawName: string,
    range: vscode.Range,
};

function getMenuParam1stData(lStr: string, col: number, line: number): TMenuParam1stData | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*Menu\b\s*,?\s*/iu, 'Menu,')
        .padStart(lStr.length, ' ')
        .replace(/\[.*/u, '');
    //  .padEnd(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // Menu, MenuName, add
    //       MenuName, add
    // ^a0   ^a1

    const atA1: TScanData | undefined = arr.at(1);
    if (atA1 === undefined) return null;
    const { lPos, RawNameNew } = atA1;

    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, lPos),
        new vscode.Position(line, lPos + RawNameNew.length),
    );
    return {
        rawName: RawNameNew.trim(),
        range,
    };
}

const memoMenuParam = new CMemo<TAhkTokenLine, TMenuParam1stData | null>(
    (AhkTokenLine: TAhkTokenLine): TMenuParam1stData | null => {
        const {
            fistWordUp,
            line,
            lStr,
            fistWordUpCol,
            SecondWordUpCol,
            SecondWordUp,
        } = AhkTokenLine;

        if (fistWordUp === '') return null;
        if (fistWordUp === 'MENU') return getMenuParam1stData(lStr, fistWordUpCol, line);
        if (SecondWordUp === 'MENU') return getMenuParam1stData(lStr, SecondWordUpCol, line);

        return null;
    },
);

export function getMenuParam_Line(AhkTokenLine: TAhkTokenLine): TMenuParam1stData | null {
    return memoMenuParam.up(AhkTokenLine);
}

export const memoFileMenuRef = new CMemo<TAhkFileData, readonly TMenuParam1stData[]>(
    (AhkFileData: TAhkFileData): readonly TMenuParam1stData[] => {
        const arr: TMenuParam1stData[] = [];
        for (const AhkTokenLine of AhkFileData.DocStrMap) {
            const m: TMenuParam1stData | null = getMenuParam_Line(AhkTokenLine);
            if (m !== null) {
                arr.push(m);
            }
        }
        return arr;
    },
);

export const memoFileMenuRefMap = new CMemo<TAhkFileData, ReadonlyMap<string, readonly TMenuParam1stData[]>>(
    (AhkFileData: TAhkFileData): ReadonlyMap<string, readonly TMenuParam1stData[]> => {
        const arr: readonly TMenuParam1stData[] = memoFileMenuRef.up(AhkFileData);
        return Map.groupBy(arr, (Data: TMenuParam1stData): string => ToUpCase(Data.rawName));
    },
);

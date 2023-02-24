/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */
import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import type { TBrackets } from '../../tools/Bracket';
import { getGuiFunc } from '../../tools/Command/GuiTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import type { TVarData } from './varMixedAnnouncement';
import { varMixedAnnouncement } from './varMixedAnnouncement';

export type TGValData = {
    rawName: string,
    range: vscode.Range,
    by: EGlobalDefBy,
};

export const enum EGlobalDefBy {
    byGlobal = 1,
    byGui = 2,
    byRef = 3,
}
export type TGlobalVal = {
    defRangeList: TGValData[],
    refRangeList: TGValData[],
};

type TUpName = string;
export type TGValMap = ReadonlyMap<TUpName, TGlobalVal>;
export type TGValMapReadOnly = ReadonlyMap<TUpName, Readonly<TGlobalVal>>;

function setGlobalVar(
    {
        varDataList,
        line,
        GValMap,
        by,
    }: { varDataList: TVarData[], line: number, GValMap: Map<string, TGlobalVal>, by: EGlobalDefBy },
): void {
    for (const { ch, rawName } of varDataList) {
        const ValUpName: string = rawName.toUpperCase();
        const oldVal: TGlobalVal | undefined = GValMap.get(ValUpName);

        const element: TGValData = {
            rawName,
            range: new vscode.Range(
                new vscode.Position(line, ch),
                new vscode.Position(line, ch + rawName.length),
            ),
            by,
        };

        if (oldVal === undefined) {
            GValMap.set(ValUpName, {
                defRangeList: [element],
                refRangeList: [],
            });
        } else {
            oldVal.defRangeList.push(element);
        }
    }
}

function isGlobal(detail: readonly EDetail[], lStr: string): boolean {
    return detail.includes(EDetail.deepAdd)
        && (/^\s*\{\s*global[,\s]/iu).test(lStr);
}

export function ahkGlobalMain(DocStrMap: TTokenStream): TGValMap {
    const GValMap = new Map<TUpName, TGlobalVal>();
    let lastLineIsGlobal = false;
    let BracketsRaw: TBrackets = [0, 0, 0];
    for (const AhkTokenLine of DocStrMap) {
        const {
            cll,
            detail,
            fistWordUp,
            line,
            lStr,
        } = AhkTokenLine;

        const guiVList: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 1);
        if (guiVList !== null) {
            // https://www.autohotkey.com/docs/v1/lib/Gui.htm#Events
            const varDataList: TVarData[] = guiVList
                .map(({ RawNameNew, lPos }: TScanData): TVarData => ({ rawName: RawNameNew, ch: lPos }));

            setGlobalVar({
                varDataList,
                line,
                GValMap,
                by: EGlobalDefBy.byGui,
            });
            continue;
        }

        if (fistWordUp === 'GLOBAL' || isGlobal(detail, lStr)) {
            if ((/\bGLOBAL\s*$/iu).test(lStr)) continue;
            lastLineIsGlobal = true;
            BracketsRaw = [0, 0, 0];
        } else if (lastLineIsGlobal && cll === 1) {
            lastLineIsGlobal = true;
        } else {
            lastLineIsGlobal = false;
            continue;
        }

        const strF: string = lStr
            .replace(/^[\s{]*global[,\s]+/iu, ',')
            .padStart(lStr.length, ' ');

        const { varDataList, Brackets } = varMixedAnnouncement(strF, BracketsRaw);
        BracketsRaw = Brackets;
        setGlobalVar({
            varDataList,
            line,
            GValMap,
            by: EGlobalDefBy.byGlobal,
        });
    }

    return GValMap;
}

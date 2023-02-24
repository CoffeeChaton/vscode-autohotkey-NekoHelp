/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,-999] }] */
/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import { getFormatConfig } from '../../configUI';
import type { TConfigs } from '../../configUI.data';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { EFormatChannel } from '../../globalEnum';
import type { TBrackets } from '../../tools/Bracket';
import { getMatrixFileBrackets } from './tools/getMatrixFileBrackets';
import { getMatrixMultLine } from './tools/getMatrixMultLine';
import { getMatrixTopLabe } from './tools/getMatrixTopLabe';
import { fn_Warn_thisLineText_WARN } from './TWarnUse';
import type { TLnStatus } from './wantRefactor/getDeepKeywords';
import { EFmtMagicStr, getDeepKeywords } from './wantRefactor/getDeepKeywords';

import type { TFmtCore, TFmtCoreMap } from './FormatType';
import { fmtDiffInfo } from './tools/fmtDiffInfo';
import { getSwitchRange, inSwitchBlock } from './wantRefactor/SwitchCase';

type TFmtCoreArgs = {
    /**
     * always update status
     */
    document: vscode.TextDocument,
    options: vscode.FormattingOptions, // TODO add more config
    fmtStart: number,
    fmtEnd: number,
    from: EFormatChannel,
    needDiff: boolean,
};

export function FormatCoreWrap(map: TFmtCoreMap): vscode.TextEdit[] {
    const textEditList: vscode.TextEdit[] = [];

    // - if all files not changed
    //
    // | ms       | 0.0.23    | 0.0.24b | x   |
    // | -------- | --------- | ------- | --- |
    // | 88-files | 1600~1800 | 450~600 | 3X  |
    // | 29-files | 700~800   | 50~80   | 10X |
    //
    // - if all files changed
    //
    // | ms       | 0.0.23    | 0.0.24b   | x  |
    // | -------- | --------- | --------- | -- |
    // | 88-files | 1600~1800 | 1600~1800 | 1X |
    // | 29-files | 700~800   | 700~800   | 1X |
    //
    // test by FormatAllFile

    for (const { line, oldText, newText } of map.values()) {
        if (oldText !== newText) {
            //      ^ performance optimization
            const endCharacter: number = Math.max(newText.length, oldText.length);
            const range = new vscode.Range(line, 0, line, endCharacter);
            textEditList.push(new vscode.TextEdit(range, newText));
        }
    }
    return textEditList;
}

export function FormatCore(
    {
        document,
        options,
        fmtStart,
        fmtEnd,
        from,
    }: TFmtCoreArgs,
): TFmtCoreMap {
    const timeStart: number = Date.now();

    const newFmtMap = new Map<number, TFmtCore>();
    /**
     * always update status
     */
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return newFmtMap;

    const userConfigs: TConfigs['format'] = getFormatConfig();
    const {
        formatTextReplace,
        useTopLabelIndent,
        AMasterSwitchUseFormatProvider,
    } = userConfigs;
    if (!AMasterSwitchUseFormatProvider) return newFmtMap;

    const { DocStrMap, uri } = AhkFileData;
    const matrixTopLabe: readonly (0 | 1)[] = getMatrixTopLabe(AhkFileData, useTopLabelIndent);
    const matrixBrackets: readonly TBrackets[] = getMatrixFileBrackets(DocStrMap);
    const matrixMultLine: readonly (-999 | 0 | 1)[] = getMatrixMultLine(DocStrMap);

    let lnStatus: TLnStatus = {
        lockList: [],
        occ: 0,
        status: 'file start',
    };
    // const memo: (Readonly<TLnStatus>)[] = [];
    // memo.push({ ...lnStatus });
    const switchRangeArray: vscode.Range[] = [];

    for (const AhkTokenLine of DocStrMap) {
        const { line, lStr } = AhkTokenLine;
        const lStrTrim: string = lStr.trim();

        if (line >= fmtStart && line <= fmtEnd) {
            const { occ, status } = lnStatus;
            const occHotFix: number = status === EFmtMagicStr.caseA
                ? occ + 1
                : occ;
            newFmtMap.set(
                line,
                fn_Warn_thisLineText_WARN({
                    lStrTrim,
                    occ: occHotFix,
                    brackets: matrixBrackets[line],
                    options,
                    switchDeep: inSwitchBlock(lStrTrim, line, switchRangeArray),
                    topLabelDeep: matrixTopLabe[line],
                    MultLine: matrixMultLine[line],
                    formatTextReplace,
                    userConfigs,
                }, AhkTokenLine),
            );
        } else if (line > fmtEnd) {
            break;
        }

        const switchRange: vscode.Range | null = getSwitchRange(DocStrMap, lStrTrim, line);
        if (switchRange !== null) switchRangeArray.push(switchRange);

        lnStatus = getDeepKeywords({
            lStrTrim,
            lnStatus,
            AhkTokenLine,
            matrixBrackets,
            DocStrMap,
        });
        // memo.push({ ...lnStatus });
    }

    // FIXME:
    if (formatTextReplace) {
        const { fsPath } = uri;
        fmtDiffInfo({
            newFmtMap,
            fsPath,
            timeStart,
            from,
        });
    }

    // console.log({ ms: Date.now() - timeStart, memo });

    return newFmtMap;
}

export const FormatProvider: vscode.DocumentFormattingEditProvider = {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        return FormatCoreWrap(FormatCore({
            document,
            options,
            fmtStart: 0,
            fmtEnd: document.lineCount - 1,
            from: EFormatChannel.byFormatAllFile,
            needDiff: true,
        }));
    },
};

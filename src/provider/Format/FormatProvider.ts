/* eslint-disable max-lines-per-function */
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,-999] }] */
import * as vscode from 'vscode';
import { getConfig } from '../../configUI';
import type { ErmFirstCommaCommand, TConfigs } from '../../configUI.data';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { EFormatChannel } from '../../globalEnum';
import type { TBrackets } from '../../tools/Bracket';
import type { TFmtCore, TFmtCoreMap } from './FormatType';
import { fmtDiffInfo } from './tools/fmtDiffInfo';
import { getFormatFlag } from './tools/getFormatFlag';
import { getMatrixAhk2exeKeep } from './tools/getMatrixAhk2exeKeep';
import { getMatrixFileBrackets } from './tools/getMatrixFileBrackets';
import { getMatrixMultLine } from './tools/getMatrixMultLine';
import { getMatrixTopLabe } from './tools/getMatrixTopLabe';
import type { TCmdSemantic } from './tools/semanticCmd';
import { getSemanticCmdShell } from './tools/semanticCmd';
import { fn_Warn_thisLineText_WARN } from './TWarnUse';
import type { TLnStatus } from './wantRefactor/getDeepKeywords';
import { getDeepKeywords } from './wantRefactor/getDeepKeywords';
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

    cmdTo1_or_2: ErmFirstCommaCommand,
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
        cmdTo1_or_2,
    }: TFmtCoreArgs,
): TFmtCoreMap {
    const timeStart: number = Date.now();

    const newFmtMap = new Map<number, TFmtCore>();

    /**
     * always update status
     */
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return newFmtMap;

    const userConfigs: TConfigs['format'] = getConfig().format;
    const {
        AMasterSwitchUseFormatProvider,
        formatTextReplace,
        removeFirstCommaDirective,
        useTopLabelIndent,
    } = userConfigs;
    if (!AMasterSwitchUseFormatProvider) return newFmtMap;

    const { DocStrMap, uri } = AhkFileData;
    const matrixTopLabe: readonly (0 | 1)[] = getMatrixTopLabe(AhkFileData, useTopLabelIndent);
    const matrixBrackets: readonly TBrackets[] = getMatrixFileBrackets(DocStrMap);
    const matrixMultLine: readonly (-999 | 0 | 1)[] = getMatrixMultLine(DocStrMap);
    const matrixAhk2exeKeep: readonly boolean[] = getMatrixAhk2exeKeep(DocStrMap);
    const cmdSemanticList: readonly TCmdSemantic[] = getSemanticCmdShell(AhkFileData);
    // const matrixCll: readonly (0 | 1)[] = getCmdCll(cmdSemanticList);
    const { mainList, betaList } = getFormatFlag(DocStrMap);

    let lnStatus: TLnStatus = {
        isHotFix22: false,
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

        if (line >= fmtStart && line <= fmtEnd && mainList[line] && !matrixAhk2exeKeep[line]) {
            const { occ, isHotFix22 } = lnStatus;
            const occHotFix: number = isHotFix22
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
                    formatTextReplace: formatTextReplace && betaList[line],
                    userConfigs,
                    betaList,
                    DocStrMap,
                    cmdTo1_or_2,
                    cmdSemanticList,
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

    if (formatTextReplace || removeFirstCommaDirective) {
        const { fsPath } = uri;
        fmtDiffInfo({
            newFmtMap,
            fsPath,
            timeStart,
            from,
        });
    }

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
            cmdTo1_or_2: getConfig().format.removeFirstCommaCommand,
        }));
    },
};

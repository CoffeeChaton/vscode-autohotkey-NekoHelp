import * as vscode from 'vscode';
import { CAhkCase, CAhkDefault, CAhkSwitch } from '../AhkSymbol/CAhkSwitch';
import { getRange } from '../tools/range/getRange';
import { getRangeCaseBlock } from '../tools/range/getRangeCaseBlock';
import type { TFuncInput } from './getChildren';
import { getChildren } from './getChildren';
import { getCaseName, getSwitchName } from './ParserTools/getSwitchCaseName';
import { ParserLine } from './ParserTools/ParserLine';

export const ParserBlock = {
    getCaseBlock(FuncInput: TFuncInput): CAhkCase | null {
        const { lStr, fistWordUp } = FuncInput.AhkTokenLine;

        if (fistWordUp !== 'CASE') return null;
        if (!lStr.includes(':')) return null;

        const {
            RangeEndLine,
            defStack,
            AhkTokenLine,
            DocStrMap,
            uri,
            GValMap,
        } = FuncInput;
        const { line, fistWordUpCol } = AhkTokenLine;

        const name: string | null = getCaseName(DocStrMap[line].textRaw, lStr);
        if (name === null) return null;

        const range = getRangeCaseBlock(DocStrMap, line, line, RangeEndLine, lStr);
        const ch = getChildren<CAhkCase>(
            [ParserBlock.getSwitchBlock, ParserLine],
            {
                DocStrMap,
                RangeStartLine: range.start.line + 1,
                RangeEndLine: range.end.line,
                defStack,
                uri,
                GValMap,
            },
        );

        const selectionRange = new vscode.Range(
            new vscode.Position(line, fistWordUpCol),
            new vscode.Position(line, fistWordUpCol + fistWordUp.length),
        );

        return new CAhkCase({
            name,
            range,
            selectionRange,
            uri,
            ch,
        });
    },

    getDefaultBlock(FuncInput: TFuncInput): CAhkDefault | null {
        const { lStr, fistWordUp } = FuncInput.AhkTokenLine;

        if (fistWordUp !== 'DEFAULT') return null;
        if (!(/^default\s*:/iu).test(lStr.trim())) return null;

        const {
            RangeEndLine,
            defStack,
            AhkTokenLine,
            DocStrMap,
            uri,
            GValMap,
        } = FuncInput;
        const { line, fistWordUpCol } = AhkTokenLine;

        const range = getRangeCaseBlock(DocStrMap, line, line, RangeEndLine, lStr);
        const ch = getChildren<CAhkDefault>(
            [ParserBlock.getSwitchBlock, ParserLine],
            {
                DocStrMap,
                RangeStartLine: range.start.line + 1,
                RangeEndLine: range.end.line,
                defStack,
                uri,
                GValMap,
            },
        );

        const selectionRange = new vscode.Range(
            new vscode.Position(line, fistWordUpCol),
            new vscode.Position(line, fistWordUpCol + fistWordUp.length),
        );

        return new CAhkDefault({
            range,
            selectionRange,
            uri,
            ch,
        });
    },

    getSwitchBlock(FuncInput: TFuncInput): CAhkSwitch | null {
        const { fistWordUp } = FuncInput.AhkTokenLine;
        if (fistWordUp !== 'SWITCH') return null;

        const {
            RangeEndLine,
            defStack,
            AhkTokenLine,
            DocStrMap,
            uri,
            GValMap,
        } = FuncInput;
        const { line, fistWordUpCol, lStr } = AhkTokenLine;

        const range = getRange(DocStrMap, line, line, RangeEndLine, fistWordUpCol);

        const ch = getChildren<CAhkSwitch>(
            [ParserBlock.getCaseBlock, ParserBlock.getDefaultBlock],
            {
                DocStrMap,
                RangeStartLine: range.start.line + 1,
                RangeEndLine: range.end.line,
                defStack,
                uri,
                GValMap,
            },
        );

        const selectionRange = new vscode.Range(
            new vscode.Position(line, fistWordUpCol),
            new vscode.Position(line, fistWordUpCol + fistWordUp.length),
        );

        return new CAhkSwitch({
            name: `Switch ${getSwitchName(lStr)}`,
            range,
            selectionRange,
            uri,
            ch,
        });
    },
} as const;

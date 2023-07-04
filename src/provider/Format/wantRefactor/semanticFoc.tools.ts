/* eslint-disable max-depth */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../../AhkSymbol/TAhkSymbolIn';
import { EDetail, type TAhkTokenLine, type TTokenStream } from '../../../globalEnum';
import { StatementMDMap } from '../../../tools/Built-in/3_foc/foc.tools';
import { getDAWithPos } from '../../../tools/DeepAnalysis/getDAWithPos';
import { getRange } from '../../../tools/range/getRange';
import { FocIfExMap, FocSetOneLine, FocSetSwitchCase } from './semanticFoc.data';
import type { TSemanticFoc } from './semanticFoc.type';

function isFocCalc(fistWordUp: string): boolean {
    if (!StatementMDMap.has(fistWordUp)) return false;
    if (FocSetSwitchCase.has(fistWordUp)) return false;
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (FocSetOneLine.has(fistWordUp) || FocIfExMap.has(fistWordUp)) {
        return false;
    }

    return true;
}
export function getFocRange(
    DocStrMap: TTokenStream,
    AST: TAstRoot,
    line: number,
): TSemanticFoc | null {
    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = DocStrMap[line]; // WTF

    if (!isFocCalc(fistWordUp)) return null;

    let lineFix = line;

    const { length } = DocStrMap;
    let i = line;
    if (DocStrMap[line].lStr.trimEnd().endsWith('{')) {
        const ahkFn: CAhkFunc | null = getDAWithPos(AST, new vscode.Position(line, 0));
        const range = getRange(DocStrMap, line, lineFix, ahkFn?.range.end.line ?? length, 0);
        return {
            nameUp: fistWordUp,
            nameEx: '',
            calcRange: false,
            case: 'at 47',
            range,
        };
    }

    for (i = line + 1; i < length; i++) {
        const { cll, detail, fistWordUp: fistWordUpEx } = DocStrMap[i];
        if (detail.includes(EDetail.deepAdd)) {
            lineFix = i;
            break;
        }
        if (cll === 0) {
            if (isFocCalc(fistWordUpEx)) {
                const z0: TSemanticFoc | null = getFocRange(DocStrMap, AST, i);
                if (z0 !== null) {
                    return {
                        nameUp: fistWordUp,
                        nameEx: '',
                        calcRange: true,
                        case: 'at 53',
                        range: new vscode.Range(
                            new vscode.Position(line, 0),
                            z0.range.end,
                        ),
                    };
                }
            }
            break;
        }
    }

    if (DocStrMap[i].lStr.trimStart().startsWith('{')) {
        const ahkFn: CAhkFunc | null = getDAWithPos(AST, new vscode.Position(line, 0));
        const range = getRange(DocStrMap, line, lineFix, ahkFn?.range.end.line ?? length, 0);
        return {
            nameUp: fistWordUp,
            nameEx: '',
            calcRange: false,
            case: 'at 72',
            range,
        };
    }

    return {
        nameUp: fistWordUp,
        nameEx: '',
        calcRange: true,
        case: 'at 81',
        range: new vscode.Range(
            new vscode.Position(line, 0),
            new vscode.Position(i, DocStrMap[i].lStr.length),
        ),
    };
}

export function inFocBlock(AhkTokenLine: TAhkTokenLine, focList: TSemanticFoc[]): number {
    const { line } = AhkTokenLine;
    const Pos = new vscode.Position(line, 0);
    let indent = 0;
    for (const foc of focList) {
        if (foc.calcRange && foc.range.start.line !== line && foc.range.contains(Pos)) {
            indent += 1;
        }
    }

    return indent;
}

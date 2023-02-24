import * as vscode from 'vscode';
import { CAhkSwitch } from '../../AhkSymbol/CAhkSwitch';
import type { TAhkSymbolList } from '../../AhkSymbol/TAhkSymbolIn';
import type { TAhkFileData } from '../../core/ProjectManager';

function searchAstDefSwitch(AST: Readonly<TAhkSymbolList>, position: vscode.Position): CAhkSwitch[] {
    const result: CAhkSwitch[] = [];
    for (const sw of AST) {
        if (sw.range.contains(position)) {
            if (sw instanceof CAhkSwitch) {
                result.push(sw);
                for (const caseOrDefault of sw.children) {
                    // eslint-disable-next-line max-depth
                    if (caseOrDefault.selectionRange.contains(position)) return result;
                }
            }
            result.push(...searchAstDefSwitch(sw.children, position));
        }
    }
    return result;
}

export function getDefSwitch(
    AhkFileData: TAhkFileData,
    uri: vscode.Uri,
    position: vscode.Position,
    wordUp: string,
): vscode.Location[] | null {
    const { DocStrMap, AST } = AhkFileData;

    const { fistWordUp, fistWordUpCol } = DocStrMap[position.line];

    if (fistWordUp === 'SWITCH' && wordUp === 'SWITCH') {
        return [
            new vscode.Location(
                uri,
                position,
            ),
        ];
    }
    if (!(wordUp === 'CASE' || wordUp === 'DEFAULT')) return null;
    if (!(fistWordUp === 'CASE' || fistWordUp === 'DEFAULT')) return null;
    if (position.character > fistWordUpCol + fistWordUp.length) return null;

    const sw: CAhkSwitch | undefined = searchAstDefSwitch(AST, position).at(-1);
    if (sw === undefined) return null;

    return [
        new vscode.Location(
            uri,
            sw.selectionRange,
        ),
    ];
}

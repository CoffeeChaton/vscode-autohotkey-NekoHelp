import * as vscode from 'vscode';
import type { CAhkCase, CAhkDefault } from '../../AhkSymbol/CAhkSwitch';
import { CAhkSwitch } from '../../AhkSymbol/CAhkSwitch';
import type { TAhkSymbolList } from '../../AhkSymbol/TAhkSymbolIn';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';

function searchAstRefSwitch(AST: Readonly<TAhkSymbolList>, position: vscode.Position): CAhkSwitch[] {
    const result: CAhkSwitch[] = [];
    for (const sw of AST) {
        if (sw.range.contains(position)) {
            if (sw instanceof CAhkSwitch) {
                result.push(sw);

                if (sw.selectionRange.contains(position)) return result;
            }
            result.push(...searchAstRefSwitch(sw.children, position));
        }
    }
    return result;
}

export function getRefSwitch(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUp: string,
): vscode.Location[] | null {
    const { DocStrMap, AST } = AhkFileData;

    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const { fistWordUp } = AhkTokenLine;

    if (fistWordUp === 'SWITCH' && wordUp === 'SWITCH') {
        const sw: CAhkSwitch | undefined = searchAstRefSwitch(AST, position).at(-1);
        if (sw === undefined) return null;

        return sw
            .children
            .map((ch: CAhkCase | CAhkDefault): vscode.Location => new vscode.Location(ch.uri, ch.selectionRange));
    }

    return null;
}

import * as vscode from 'vscode';
import type { TClassChildren } from '../../AhkSymbol/CAhkClass';
import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';

function getThisMethodCore(ahClass: CAhkClass, wordUp: string): [vscode.Location] | null {
    const method: CAhkFunc | undefined = ahClass
        .children
        .find((ch: TClassChildren): ch is CAhkFunc => ch instanceof CAhkFunc && ch.upName === wordUp);

    if (method === undefined) return null;

    return [
        new vscode.Location(
            method.uri,
            method.selectionRange,
        ),
    ];
}

export function getThisMethod(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
): vscode.Location[] | null {
    const { DocStrMap, AST } = AhkFileData;

    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const { lStr } = AhkTokenLine;

    const { character } = position;
    for (const ma of lStr.matchAll(/(?<=\bthis)\.(\w+)\(/giu)) {
        const { index } = ma;
        if (undefined === index) continue;
        const wordRaw: string = ma[1];

        if (index < character && character <= index + wordRaw.length + 1) {
            const matchClass: CAhkClass | undefined = AST
                .find((ah: TTopSymbol): ah is CAhkClass => ah instanceof CAhkClass && ah.range.contains(position));

            if (matchClass !== undefined) {
                return getThisMethodCore(matchClass, wordRaw.toUpperCase());
            }
        }
    }
    return null;
}

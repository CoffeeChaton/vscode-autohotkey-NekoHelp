import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { EDetail } from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';

/**
 * <https://devblogs.microsoft.com/typescript/announcing-typescript-4-9/#go-to-definition-on-return-keywords>
 */
export function getDefReturn2Func(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
    wordUp: string,
): [vscode.LocationLink] | null {
    if (wordUp !== 'RETURN') return null;

    const { character, line } = position;
    const { DocStrMap, AST } = AhkFileData;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    if (DA === null) return null;

    const endLine: number = DA.range.end.line;
    for (let i = DA.selectionRange.end.line; i < endLine; i++) {
        if (DocStrMap[i].detail.includes(EDetail.isLabelLine)) {
            return null;
        }
    }

    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = DocStrMap[line];

    if (fistWordUp === 'RETURN' && (character >= fistWordUpCol && character <= fistWordUpCol + 'RETURN'.length)) {
        return [
            {
                targetUri: DA.uri,
                targetRange: DA.selectionRange,
            },
        ];
    }

    if (SecondWordUp === 'RETURN' && (character >= SecondWordUpCol && character <= SecondWordUpCol + 'RETURN'.length)) {
        return [
            {
                targetUri: DA.uri,
                targetRange: DA.selectionRange,
            },
        ];
    }

    return null;
}

import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { getUserDefTopClassSymbol } from '../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { getFucDefWordUpFix } from '../Def/getFucDefWordUpFix';
import { isPosAtMethodName } from '../Def/isPosAtMethodName';

export function CallHierarchy_core(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
): vscode.CallHierarchyItem | vscode.CallHierarchyItem[] | null {
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        position,
        /(?<=[%!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)[#$@\w\u{A1}-\u{FFFF}]+/u,
        // without .` and #$@
    );
    if (range === undefined) return [];
    const { DocStrMap, AST } = AhkFileData;

    const wordUp: string = ToUpCase(document.getText(range));
    const wordUpFix: string = getFucDefWordUpFix(DocStrMap[position.line], wordUp, position.character);

    const DA: CAhkFunc | null = getFuncWithName(wordUpFix);
    if (DA !== null) {
        const DA2: CAhkFunc | null = getDAWithPos(AST, position);
        if (DA2 !== null && isPosAtMethodName(DA2, position)) {
            return null; // just support fn/class now
        }

        return new vscode.CallHierarchyItem(
            vscode.SymbolKind.Function,
            DA.name,
            DA.detail,
            DA.uri,
            DA.range,
            DA.selectionRange,
        );
    }

    const classDef: CAhkClass | null = getUserDefTopClassSymbol(wordUp);
    if (classDef !== null) {
        return new vscode.CallHierarchyItem(
            vscode.SymbolKind.Class,
            classDef.name,
            classDef.detail,
            classDef.uri,
            classDef.range,
            classDef.selectionRange,
        );
    }
    // getClassDef(wordUp, listAllUsing)

    return null;
}

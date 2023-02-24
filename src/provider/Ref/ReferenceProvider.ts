import type * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getClassDef } from '../Def/getClassDef';
import { posAtLabelDef } from '../Def/getDefWithLabel';
import { getFuncDef } from '../Def/getFuncDef';
import { getRefSwitch } from '../Def/getRefSwitch';
import { getValDefInFunc } from '../Def/getValDefInFunc';

function ReferenceProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | null {
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/iu);
    if (range === undefined) return null;
    const wordUp: string = document.getText(range).toUpperCase();

    const labelRef: vscode.Location[] | null = posAtLabelDef(AhkFileData, position, wordUp);
    if (labelRef !== null) return labelRef;

    const swLoc: vscode.Location[] | null = getRefSwitch(AhkFileData, position, wordUp);
    if (swLoc !== null) return swLoc;

    const listAllUsing = true;
    const userDefLink: vscode.Location[] | null = getFuncDef(AhkFileData, position, wordUp, listAllUsing);
    if (userDefLink !== null) return userDefLink;

    const classDef: vscode.Location[] | null = getClassDef(wordUp, listAllUsing);
    if (classDef !== null) return classDef; // class name is variable name, should before function.variable name

    const valInFunc: vscode.Location[] | null = getValDefInFunc(
        AhkFileData,
        document.uri,
        position,
        wordUp,
        listAllUsing,
    );
    if (valInFunc !== null) return valInFunc;
    return null;
}

function just2Ref(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | null {
    const loc: vscode.Location[] | null = ReferenceProviderCore(document, position);
    if (loc === null || loc.length !== 2) return loc;

    const loc0: vscode.Location = loc[0];
    if (loc0.uri.fsPath === document.uri.fsPath && loc0.range.contains(position)) {
        return [loc[1]];
    }

    return [loc0];
}

//  Go to References search (via Shift+F12),
export const ReferenceProvider: vscode.ReferenceProvider = {
    provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        _context: vscode.ReferenceContext,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Location[]> {
        return just2Ref(document, position);
    },
};

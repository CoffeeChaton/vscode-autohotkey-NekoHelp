import type * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getClassDef } from './getClassDef';
import { getDefSwitch } from './getDefSwitch';
import { getDefWithLabel } from './getDefWithLabel';
import { getFuncDef } from './getFuncDef';
import { getThisMethod } from './getThisMethod';
import { getValDefInFunc } from './getValDefInFunc';

function DefProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | null {
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    const methodDef: vscode.Location[] | null = getThisMethod(AhkFileData, position);
    if (methodDef !== null) return methodDef;

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`#])\b\w+\b/u);
    if (range === undefined) return null;
    const wordUp: string = document.getText(range).toUpperCase();

    if ((/^0x[A-F\d]+$/iu).test(wordUp) || (/^\d+$/u).test(wordUp)) return null;

    const listAllUsing = false;

    const switchDef: vscode.Location[] | null = getDefSwitch(AhkFileData, document.uri, position, wordUp);
    if (switchDef !== null) return switchDef;

    const LabelDef: vscode.Location[] | null = getDefWithLabel(AhkFileData, document.uri, position, wordUp);
    if (LabelDef !== null) return LabelDef;

    const userDefFuncLink: vscode.Location[] | null = getFuncDef(AhkFileData, position, wordUp, listAllUsing);
    if (userDefFuncLink !== null) return userDefFuncLink;

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

/*
 * Go to Definition (via F12 || Ctrl+Click)
 * open the definition to the side with ( via Ctrl+Alt+Click )
 * Peek Definition (via Alt+F12)
 */
export const DefProvider: vscode.DefinitionProvider = {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        return DefProviderCore(document, position);
    },
};

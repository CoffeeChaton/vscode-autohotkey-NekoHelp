import type * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { ToUpCase } from '../../tools/str/ToUpCase';
import type { TWmThisPos } from '../CompletionItem/classThis/getWmThis';
import { getClassDef } from '../Def/getClassDef';
import { ClassProperty2Range, getClassProperty } from '../Def/getClassProperty';
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

    const property: readonly TWmThisPos[] | null = getClassProperty(document, position, AhkFileData);
    if (property !== null) return ClassProperty2Range(property, document.uri, true);

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        position,
        /(?<=[%!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)[#$@\w\u{A1}-\u{FFFF}]+/iu,
        //      without .` and #$@
    );
    if (range === undefined) return null;
    const wordUp: string = ToUpCase(document.getText(range));
    const listAllUsing = true;

    return posAtLabelDef(AhkFileData, position, wordUp)
        ?? getRefSwitch(AhkFileData, position, wordUp)
        ?? getFuncDef(AhkFileData, position, wordUp, listAllUsing)
        ?? getClassDef(wordUp, listAllUsing) // class name is variable name, should before function.variable name
        ?? getValDefInFunc(AhkFileData, document.uri, position, wordUp, listAllUsing);
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

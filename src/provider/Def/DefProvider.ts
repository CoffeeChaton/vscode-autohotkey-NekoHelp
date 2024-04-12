import type * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { gotoDirectivesDef } from '../../tools/Built-in/0_directive/Directives.tool';
import { biAVarDefMap } from '../../tools/Built-in/1_built_in_var/A_Variables.tools';
import { biBVarDefMap } from '../../tools/Built-in/1_built_in_var/BiVariables.tools';
import { focDefMap } from '../../tools/Built-in/3_foc/foc.tools';
import { cmdDefMap } from '../../tools/Built-in/6_command/Command.tools';
import { ToUpCase } from '../../tools/str/ToUpCase';
import type { TWmThisPos } from '../CompletionItem/classThis/getWmThis';
import { getClassDef } from './getClassDef';
import { ClassProperty2Range, getClassProperty } from './getClassProperty';
import { getDefReturn2Func } from './getDefReturn2Func';
import { getDefSwitch } from './getDefSwitch';
import { getDefWithLabelWrap } from './getDefWithLabel';
import { getFuncDef } from './getFuncDef';
import { getMethodDef } from './getMethodDef';
import { getValDefInFunc } from './getValDefInFunc';
import { gotoIncludeDef } from './gotoIncludeDef';

function DefProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | vscode.LocationLink[] | null {
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    const IncludeFile: vscode.LocationLink | null = gotoIncludeDef(AhkFileData, position);
    if (IncludeFile !== null) return [IncludeFile];

    const AhkTokenLine: TAhkTokenLine = AhkFileData.DocStrMap[position.line];
    const DirectivesDef: [vscode.Location] | null = gotoDirectivesDef(position, AhkTokenLine);
    if (DirectivesDef !== null) return DirectivesDef;

    const methodDef: vscode.Location[] | null = getMethodDef(document, position, AhkFileData);
    if (methodDef !== null) return methodDef;
    const property: readonly TWmThisPos[] | null = getClassProperty(document, position, AhkFileData);
    if (property !== null) return ClassProperty2Range(property, document.uri, false);

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        position,
        /(?<=[%!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)[#$@\w\u{A1}-\u{FFFF}]+/u,
        // // without .` and #$@
    );
    if (range === undefined) return null;
    const wordUp: string = ToUpCase(document.getText(range));

    if ((/^0x[A-F\d]+$/iu).test(wordUp) || (/^\d+$/u).test(wordUp)) return null;

    const listAllUsing = false;

    const Return2FuncLoc: [vscode.LocationLink] | null = getDefReturn2Func(AhkFileData, position, wordUp);
    if (Return2FuncLoc !== null) return Return2FuncLoc;

    const switchDef: vscode.Location[] | null = getDefSwitch(AhkFileData, document.uri, position, wordUp);
    if (switchDef !== null) return switchDef;

    const LabelDef: vscode.Location[] | null = getDefWithLabelWrap(AhkFileData, position, wordUp);
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

    const jsonDef: [vscode.Location] | undefined = biAVarDefMap.get(wordUp)
        ?? biBVarDefMap.get(wordUp)
        ?? cmdDefMap.get(wordUp)
        ?? focDefMap.get(wordUp);
    if (jsonDef !== undefined) return jsonDef;

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

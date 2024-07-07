/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { hoverWindowsClassIdentifiers } from '../../tools/Built-in/100_other/CLSID/WindowsClassIdentifiers.tools';
import { hover2winMsgMd } from '../../tools/Built-in/100_other/Windows_Messages/Windows_Messages.tools';
import { hoverWinTitleParam } from '../../tools/Built-in/100_other/WinTitle/WinTitleParameter.tools';
import { HotKeyOpt } from '../../tools/Built-in/10_HotKey/HotKeyOpt.tool';
import { hoverAVar } from '../../tools/Built-in/1_built_in_var/A_Variables.tools';
import { hoverBiVar } from '../../tools/Built-in/1_built_in_var/BiVariables.tools';
import { getBuiltInFuncMD } from '../../tools/Built-in/2_built_in_function/func.tools';
import { getHoverStatement } from '../../tools/Built-in/3_foc/foc.tools';
import { getHoverOperator } from '../../tools/Built-in/4_operator/operator.tools';
import { getHoverDeclaration } from '../../tools/Built-in/5_declaration/declaration.tools';
import { getHoverCommand2 } from '../../tools/Built-in/6_command/Command.tools';
import { hoverAhk2exe } from '../../tools/Built-in/99_Ahk2Exe_compiler/Ahk2exe.tools';
import { HotStringsOptions } from '../../tools/Built-in/9_HotStrings_Options/HotStringsOptions.tool';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { ClassProperty2Md } from '../Def/getClassProperty';
import { getFucDefWordUpFix } from '../Def/getFucDefWordUpFix';
import { hover_at_func_or_method_def } from './tools/hover_at_func_or_method_def';
import { hoverAhkObj } from './tools/hoverAhkObj';
import { hoverClassName } from './tools/hoverClassName';
import { hoverComObjActive } from './tools/hoverComObjActive';
import { hoverControlGetParam } from './tools/hoverControlGetParam';
import { hoverControlParam } from './tools/hoverControlParam';
import { DeepAnalysisHover } from './tools/HoverDeepAnalysis';
import { hoverDirectives } from './tools/hoverDirectives';
import { hoverErrorLevel } from './tools/hoverErrorLevel';
import { hoverFocEx } from './tools/hoverFocEx';
import { hoverGlobalVar } from './tools/hoverGlobalVar';
import { hoverGuiControlParam } from './tools/hoverGuiControlParam';
import { hoverGuiParam } from './tools/hoverGuiParam';
import { hoverLabel } from './tools/hoverLabel';
import { hoverLabelOrFunc } from './tools/hoverLabelFn';
import { hoverMenuParam } from './tools/hoverMenuParam';
import { hoverMethod } from './tools/hoverMethod';
import { hoverMsgBoxMagicNumber } from './tools/hoverMsgBoxMagicNumber';
import { hoverMultiLine } from './tools/hoverMultiLine';
import { hoverRegion } from './tools/hoverRegion';
import { hoverSysGetParam } from './tools/hoverSysGetParam';
import { hoverVba } from './tools/hoverVba';
import { hoverWinGetParam } from './tools/hoverWinGetParam';
import { hoverWinSetParam } from './tools/hoverWinSetParam';

function HoverOfFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        position,
        /(?<=[!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)[#$@\w\u{A1}-\u{FFFF}]+(?=\()/u,
        // without .%` and #$@
    );
    if (range === undefined) return null;

    const wordUp: string = ToUpCase(document.getText(range));
    const DA: CAhkFunc | null = getFuncWithName(wordUp);
    if (DA !== null) return DA.md;

    const BuiltInFuncMD: vscode.MarkdownString | undefined = getBuiltInFuncMD(wordUp)?.md;
    if (BuiltInFuncMD !== undefined) return BuiltInFuncMD;

    return null; // not userDefFunc of BiFunc
}

function HoverProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Hover | null {
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    const { AST, DocStrMap } = AhkFileData;

    // ^\s*\( Trim
    const mdOfMultiLine: vscode.MarkdownString | null = hoverMultiLine(DocStrMap, position);
    if (mdOfMultiLine !== null) return new vscode.Hover(mdOfMultiLine);

    // pos at Comment range...
    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const { lStr } = AhkTokenLine;
    if (position.character > lStr.length) {
        return hoverAhk2exe(AhkTokenLine, position) ?? hoverRegion(AhkTokenLine, position);
    }

    // ex: #Warn
    const DirectivesMd: vscode.Hover | null = hoverDirectives(position, AhkTokenLine, AhkFileData)
        ?? hoverMsgBoxMagicNumber(AhkTokenLine, position)
        ?? HotStringsOptions(position, AhkFileData, document)
        ?? hoverVba(document, AhkFileData, position)
        ?? hoverComObjActive(document, position)
        ?? hoverAhkObj(document, AhkFileData, position);
    if (DirectivesMd !== null) return DirectivesMd;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    const haveFunc: vscode.MarkdownString | null = hover_at_func_or_method_def(position, DA)
        ?? HoverOfFunc(document, position)
        ?? hoverMethod(document, position, AhkFileData)
        ?? ClassProperty2Md(document, position, AhkFileData)
        ?? HotKeyOpt(position, AhkFileData);
    if (haveFunc !== null) return new vscode.Hover(haveFunc);

    //
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        position,
        /(?<=[%!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)[#$@\w\u{A1}-\u{FFFF}]+(?!\()/u,
        //      without .` and #$@ .. and not ent with `(`
    );
    if (range === undefined) return null;

    const wordUp: string = ToUpCase(document.getText(range));

    const labelMd: vscode.MarkdownString | null = hoverClassName(AhkFileData, position, wordUp)
        ?? hoverLabel(AhkFileData, position, wordUp)
        ?? hoverLabelOrFunc(AhkFileData, AhkTokenLine, wordUp, position)
        ?? hoverErrorLevel(AhkFileData, position, wordUp);
    if (labelMd !== null) return new vscode.Hover(labelMd);

    type TF0 = (AhkTokenLine: TAhkTokenLine, position: vscode.Position) => vscode.MarkdownString | null;
    const fnList: TF0[] = [
        hoverFocEx,
        hoverGuiParam,
        hoverGuiControlParam,
        hoverMenuParam,
        hoverSysGetParam,
        hoverWinSetParam,
        hoverWinGetParam,
        hoverControlParam,
        hoverControlGetParam,
    ];
    for (const fn of fnList) {
        const param: vscode.MarkdownString | null = fn(AhkTokenLine, position);
        if (param !== null) return new vscode.Hover(param);
    }

    if (DA !== null) {
        const DAmd: vscode.MarkdownString | null = DeepAnalysisHover(DA, wordUp, position);
        if (DAmd !== null) return new vscode.Hover(DAmd);
    }

    const wordUpFix: string = getFucDefWordUpFix(AhkTokenLine, wordUp, position.character);
    if (
        (wordUp.startsWith('V') && `V${wordUpFix}` === wordUp)
        || (wordUp.startsWith('HWND') && `HWND${wordUpFix}` === wordUp)
    ) {
        const guiVVar: vscode.MarkdownString | null = hoverGlobalVar(wordUpFix);
        if (guiVVar !== null) return new vscode.Hover(guiVVar);
    }

    type TFn = (wordUp: string) => vscode.MarkdownString | null | undefined;
    for (
        const fn of [
            getHoverCommand2,
            getHoverDeclaration,
            getHoverOperator,
            getHoverStatement,
            hoverAVar,
            hoverWinTitleParam,
            hoverBiVar,
            hoverGlobalVar,
            hover2winMsgMd,
        ] as const satisfies readonly TFn[]
    ) {
        const md: vscode.MarkdownString | null | undefined = fn(wordUp);
        if (md !== undefined && md !== null) return new vscode.Hover(md);
    }

    const mdCLSID: vscode.MarkdownString | null = hoverWindowsClassIdentifiers(AhkTokenLine, position);
    if (mdCLSID !== null) return new vscode.Hover(mdCLSID);

    return null;
}

export const HoverProvider: vscode.HoverProvider = {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Hover> {
        return HoverProviderCore(document, position);
    },
};

/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { getSnipDirectives } from '../../tools/Built-in/0_directive/Directives.tool';
import { getSnipCLSID } from '../../tools/Built-in/100_other/CLSID/WindowsClassIdentifiers.tools';
import { getSnipOtherKeyWord } from '../../tools/Built-in/100_other/Keys_and_other/ahkSnippets.tools';
import { getSnipStartJoy } from '../../tools/Built-in/100_other/Keys_and_other/Joystick';
import { getSnipStartF } from '../../tools/Built-in/100_other/Keys_and_other/keyF12';
import { getSnipMouseKeyboard } from '../../tools/Built-in/100_other/Keys_and_other/MouseKeyboard';
import { getSnipStartNum } from '../../tools/Built-in/100_other/Keys_and_other/NumpadSnippets';
import { getSnipAhkSend } from '../../tools/Built-in/100_other/Send_tools';
import { getSnippetWinMsg } from '../../tools/Built-in/100_other/Windows_Messages/Windows_Messages.tools';
import { getSnippetWinTitleParam } from '../../tools/Built-in/100_other/WinTitle/WinTitleParameter.tools';
import { getSnippetStartWihA, snippetStartWihA } from '../../tools/Built-in/1_built_in_var/A_Variables.tools';
import { getSnipBiVar } from '../../tools/Built-in/1_built_in_var/BiVariables.tools';
import { BuiltInFunc2Completion } from '../../tools/Built-in/2_built_in_function/func.tools';
import { getSnippetStatement as getSnippetFoc } from '../../tools/Built-in/3_foc/foc.tools';
import { getSnipFocEx } from '../../tools/Built-in/3_foc/focEx.tools';
import { getSnippetOperator } from '../../tools/Built-in/4_operator/operator.tools';
import { getSnipDeclaration } from '../../tools/Built-in/5_declaration/declaration.tools';
import { getSnipCmd } from '../../tools/Built-in/6_command/Command.tools.completion';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { ahk_group_completion } from './ahk_group/ahk_group';
import { ahkDocCompletions } from './ahkDoc/ahkDocCompletions';
import { completionsJsDocTag } from './ahkDoc/jsDocTagNames';
import { wrapClass } from './classThis/wrapClass';
import { getCommentCompletion } from './commentCompletion/getCommentCompletion';
import { getRegionCompletion } from './commentCompletion/getRegionCompletion';
import { CompletionUserDefFuncClass } from './CompletionUserDef/CompletionUserDefFuncClass';
import { DeepAnalysisToCompletionItem } from './DA/DeepAnalysisToCompletionItem';
import { getDllCallCompletion } from './DllCall/DllCall';
import { getSnipGlobalVal } from './global/globalValCompletion';
import { getNormalPathCompletion } from './IncludeFsPath/getNormalPathCompletion';
import { IncludeFsPath } from './IncludeFsPath/IncludeFsPath';
import { getMenuNameCompletion } from './MenuName/getMenuNameCompletion';
import { getSnipModuleVar } from './ModuleVar/ModuleVar2Completion';
import { getSnipSubCmd } from './SubCommand/getSnipSubCmd';
import { getComObjActiveCompletion } from './vba/2Completion/getComObjActiveCompletion';
import { wrapVba2Completion } from './vba/wrapVba';

function getPartStr(lStr: string, position: vscode.Position): string | null {
    const match: RegExpMatchArray | null = lStr
        .slice(0, position.character)
        .match(/(?<=[%!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)([#$@\w\u{A1}-\u{FFFF}]+)$/u);
    //                  ^ without .` and #$@

    return match === null
        ? null
        : match[1];
}

function CompletionItemCore(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.CompletionContext,
): vscode.CompletionItem[] {
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return [];
    const {
        AST,
        DocStrMap,
        ModuleVar,
    } = AhkFileData;

    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const {
        lStr,
        textRaw,
        fistWordUp,
        detail,
    } = AhkTokenLine;
    const subStr: string = lStr.slice(0, position.character).trim();

    if (detail.includes(EDetail.isDirectivesLine) && (/^\s*#Include(?:Again)?\s/iu).test(lStr)) {
        if (context.triggerCharacter === '/' || context.triggerCharacter === '\\') {
            return IncludeFsPath(document, position, AhkFileData, AhkTokenLine);
        }
        if (context.triggerCharacter === '%') {
            return [...snippetStartWihA];
        }
    }

    if ((/\bnew[ \t]+[#$@\w\u{A1}-\u{FFFF}]*$/iu).test(lStr.slice(0, position.character))) {
        return CompletionUserDefFuncClass(subStr, AhkFileData)
            .filter((v: vscode.CompletionItem): boolean => v.kind === vscode.CompletionItemKind.Class);
    }

    const topSymbol: TTopSymbol | undefined = AST.find((top: TTopSymbol): boolean => top.range.contains(position));

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    const PartStr: string | null = getPartStr(lStr, position);

    const completions: vscode.CompletionItem[] = [];

    if (detail.includes(EDetail.inCommentAhkDoc)) {
        completions.push(
            ...ahkDocCompletions(AhkFileData, AhkTokenLine, position, context),
            ...completionsJsDocTag(context),
        );

        return completions; //
    }

    if (detail.includes(EDetail.inComment)) {
        return [...getRegionCompletion(document, position)];
    }

    // ----
    const justMenuName: vscode.CompletionItem[] = getMenuNameCompletion(AhkFileData, AhkTokenLine, position);
    if (justMenuName.length > 0) return justMenuName;
    const ahk_group: vscode.CompletionItem[] | null = ahk_group_completion(AhkTokenLine, position);
    if (ahk_group !== null) return ahk_group;
    // ---

    completions.push(
        ...wrapClass(position, textRaw, lStr, topSymbol, AhkFileData, DA), // '.'
        ...wrapVba2Completion(position, textRaw, lStr, AhkFileData, DA), // '.'
        ...getSnipAhkSend(AhkFileData, position), // '{'
        ...getSnipDirectives(subStr), // #warn
        ...getSnipDeclaration(lStr), // local
        ...getSnipCmd(subStr, AhkTokenLine), // MsgBox
        ...getSnipSubCmd(subStr, AhkTokenLine), // Gui..
        ...getSnipGlobalVal(AhkTokenLine, position),
        ...getSnipFocEx(subStr),
        ...getSnipOtherKeyWord(subStr),
        ...getSnipMouseKeyboard(subStr),
        ...getSnipCLSID(AhkTokenLine, position, context),
        ...getDllCallCompletion(AhkFileData, position),
        ...getComObjActiveCompletion(AhkFileData, position, document, context),
        ...getNormalPathCompletion(document.uri, position, AhkTokenLine, context),
    );

    if (PartStr !== null) {
        completions.push(
            ...getSnipModuleVar(ModuleVar, DA, PartStr, document.uri.fsPath),
            ...CompletionUserDefFuncClass(subStr, AhkFileData),
        );

        if (DA !== null) {
            completions.push(...DeepAnalysisToCompletionItem(DA, PartStr));
        }

        if ((/^\w+$/u).test(PartStr)) {
            // built in just has ascii
            completions.push(
                ...getSnippetStartWihA(PartStr),
                ...getSnippetWinTitleParam(PartStr),
                ...getSnippetFoc(PartStr, fistWordUp, AhkTokenLine),
                ...getSnippetWinMsg(PartStr),
                ...getSnipBiVar(PartStr),
                ...BuiltInFunc2Completion(PartStr),
                ...getSnipStartJoy(PartStr),
                ...getSnipStartNum(PartStr), // Numpad6
                ...getSnipStartF(PartStr), // F1 - F24
                ...getSnippetOperator(PartStr), // AND or
            );
        }
    }

    return completions;
}

// icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
export const CompletionItemProvider: vscode.CompletionItemProvider = {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        context: vscode.CompletionContext,
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        if (context.triggerCharacter === '@') {
            const commentCompletion: vscode.CompletionItem[] | null = getCommentCompletion(document, position);
            if (commentCompletion !== null) return commentCompletion;
        }
        if (context.triggerCharacter === '#') {
            const commentCompletion: vscode.CompletionItem[] = getRegionCompletion(document, position);
            if (commentCompletion.length > 0) return commentCompletion;
        }
        return CompletionItemCore(document, position, context);
    },
};

/*
Functions are assume-local by default. Variables accessed or created inside an assume-local function are local by default,
with the following exceptions:

Super-global variables, including classes.
A dynamic variable reference may resolve to an existing global variable if no local variable exists by that name.
Commands that create pseudo-arrays may create all elements as global even if only the first element is declared.
*/
// TODO https://www.autohotkey.com/docs/v1/KeyList.htm

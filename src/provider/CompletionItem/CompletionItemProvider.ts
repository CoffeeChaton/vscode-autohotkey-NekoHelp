import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { snipDirectives } from '../../tools/Built-in/0_directive/Directives.tool';
import { getSnippetCLSID } from '../../tools/Built-in/100_other/CLSID/WindowsClassIdentifiers.tools';
import { getSnipJustSnip } from '../../tools/Built-in/100_other/Keys_and_other/ahkSnippets.tools';
import { getSnipStartJoy } from '../../tools/Built-in/100_other/Keys_and_other/Joystick';
import { getSnipStartF } from '../../tools/Built-in/100_other/Keys_and_other/keyF12';
import { getSnipMouseKeyboard } from '../../tools/Built-in/100_other/Keys_and_other/MouseKeyboard';
import { getSnipStartNum } from '../../tools/Built-in/100_other/Keys_and_other/NumpadSnippets';
import { ahkSend } from '../../tools/Built-in/100_other/Send_tools';
import { getSnippetWinMsg } from '../../tools/Built-in/100_other/Windows_Messages/Windows_Messages.tools';
import { getSnippetWinTitleParam } from '../../tools/Built-in/100_other/WinTitle/WinTitleParameter.tools';
import { getSnippetStartWihA } from '../../tools/Built-in/1_built_in_var/A_Variables.tools';
import { getSnipBiVar } from '../../tools/Built-in/1_built_in_var/BiVariables.tools';
import { BuiltInFunc2Completion } from '../../tools/Built-in/2_built_in_function/func.tools';
import { getSnippetStatement } from '../../tools/Built-in/3_foc/foc.tools';
import { getSnipStatement2 } from '../../tools/Built-in/3_foc/foc2.tools';
import { getSnippetOperator } from '../../tools/Built-in/4_operator/operator.tools';
import { getSnippetDeclaration } from '../../tools/Built-in/5_declaration/declaration.tools';
import { getSnippetCommand } from '../../tools/Built-in/6_command/Command.tools.completion';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { ahkDocCompletions } from './ahkDoc/ahkDocCompletions';
import { wrapClass } from './classThis/wrapClass';
import { getCommentCompletion } from './commentCompletion/getCommentCompletion';
import { CompletionUserDefFuncClass } from './CompletionUserDef/CompletionUserDefFuncClass';
import { DeepAnalysisToCompletionItem } from './DA/DeepAnalysisToCompletionItem';
import { globalValCompletion } from './global/globalValCompletion';
import { IncludeFsPath } from './Include_fsPath/Include_fsPath';
import { ModuleVar2Completion } from './ModuleVar/ModuleVar2Completion';
import { completionSubCommand } from './SubCommand/completionSubCommand';

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
    const { AST, DocStrMap, ModuleVar } = AhkFileData;

    const AhkTokenLine: TAhkTokenLine = DocStrMap[position.line];
    const {
        lStr,
        textRaw,
        fistWordUp,
        detail,
    } = AhkTokenLine;
    const subStr: string = lStr.slice(0, position.character).trim();

    if (detail.includes(EDetail.isDirectivesLine) && (/^\s*#Include(?:Again)?\s/iu).test(lStr)) {
        return IncludeFsPath(document.uri.fsPath, position);
    }

    if ((/\bnew[ \t]+[#$@\w\u{A1}-\u{FFFF}]*$/iu).test(lStr.slice(0, position.character))) {
        return CompletionUserDefFuncClass(subStr, AhkFileData)
            .filter((v: vscode.CompletionItem): boolean => v.kind === vscode.CompletionItemKind.Class);
    }

    const topSymbol: TTopSymbol | undefined = AST.find((top: TTopSymbol): boolean => top.range.contains(position));

    const DA: CAhkFunc | null = getDAWithPos(AST, position);
    const PartStr: string | null = getPartStr(lStr, position);

    const completions: vscode.CompletionItem[] = [
        ...wrapClass(position, textRaw, lStr, topSymbol, AhkFileData, DA), // '.'
        ...ahkSend(AhkFileData, position), // '{'
        ...snipDirectives(subStr),
        ...getSnippetDeclaration(lStr, AhkTokenLine),
        ...getSnippetCommand(subStr, AhkTokenLine),
        ...completionSubCommand(subStr, AhkTokenLine),
        ...globalValCompletion(DocStrMap, position),
        ...getSnipStatement2(subStr, AhkTokenLine),
        ...getSnipJustSnip(subStr),
        ...getSnipMouseKeyboard(subStr),
        ...getSnippetCLSID(AhkTokenLine, position, context),
        ...ahkDocCompletions(AhkFileData, AhkTokenLine, position, context),
    ];

    if (PartStr !== null) {
        completions.push(
            ...ModuleVar2Completion(ModuleVar, DA, PartStr, document.uri.fsPath),
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
                ...getSnippetStatement(PartStr, fistWordUp, AhkTokenLine),
                ...getSnippetWinMsg(PartStr),
                ...getSnipBiVar(PartStr),
                ...BuiltInFunc2Completion(PartStr),
                ...getSnipStartJoy(PartStr),
                ...getSnipStartNum(PartStr),
                ...getSnipStartF(PartStr),
                ...getSnippetOperator(PartStr),
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

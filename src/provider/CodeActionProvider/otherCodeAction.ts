/* eslint-disable sonarjs/no-duplicate-string */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { AnalyzeFuncMain } from '../../command/AnalyzeFunc/AnalyzeThisFunc';
import type { CmdFindFuncRef } from '../../command/CmdFindFuncRef';
import type { CmdFnAddAhkDoc } from '../../command/CmdFnAddAhkDoc';
import type { CmdGotoFuncDef } from '../../command/CmdGotoFuncDef';
import { ECommand } from '../../command/ECommand';
import { getConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { EDetail, type TAhkTokenLine } from '../../globalEnum';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { getFileAllFunc } from '../../tools/visitor/getFileAllFuncList';
import type { showUnknownAnalyze } from '../CodeLens/showUnknownAnalyze';
import { getFucDefWordUpFix } from '../Def/getFucDefWordUpFix';
import { posAtFnRef } from '../Def/posAtFnRef';
import { CodeActionAddGuiName } from './tools/CodeActionAddGuiName';
import { CodeActionCmdGetErrorLevel } from './tools/CodeActionCmdGetErrorLevel';
import { CodeActionIncludePath } from './tools/CodeActionIncludePath';

function atFnHead(
    ahkFn: CAhkFunc,
    AhkFileData: TAhkFileData,
    active: vscode.Position,
    CodeAction2GotoDefRef: boolean,
): vscode.CodeAction[] {
    const { DocStrMap, uri } = AhkFileData;
    const need: vscode.CodeAction[] = [];

    if (!ahkFn.meta.ahkDocMeta.hasAhkDoc) {
        const CA0 = new vscode.CodeAction('add ahkDoc');
        CA0.command = {
            title: 'add ahkDoc',
            command: ECommand.CmdFnAddAhkDoc,
            tooltip: 'by neko-help dev tools',
            arguments: [
                ahkFn,
            ] satisfies Parameters<typeof CmdFnAddAhkDoc>,
        };
        need.push(CA0);
    }

    const CA1 = new vscode.CodeAction('Analyze this Function');
    CA1.command = {
        title: 'Analyze this Function',
        command: ECommand.showFuncAnalyze,
        tooltip: 'by neko-help dev tools',
        arguments: [
            ahkFn,
            DocStrMap.slice(ahkFn.selectionRange.start.line + 1, ahkFn.range.end.line + 1),
        ] satisfies Parameters<typeof AnalyzeFuncMain>,
    };
    need.push(CA1);

    if (ahkFn.textMap.size > 0) {
        const CA2 = new vscode.CodeAction('unknownText');
        CA2.command = {
            title: 'unknownText',
            command: ECommand.showUnknownAnalyze,
            tooltip: 'by neko-help dev tools',
            arguments: [ahkFn] satisfies Parameters<typeof showUnknownAnalyze>,
        };
        need.push(CA2);
    }

    if (CodeAction2GotoDefRef) {
        const CA3 = new vscode.CodeAction('Find All Reference');
        CA3.command = {
            title: 'Find All Reference',
            command: ECommand.CmdFindFuncRef,
            tooltip: 'by neko-help dev tools',
            arguments: [
                uri,
                active,
                ahkFn,
            ] satisfies Parameters<typeof CmdFindFuncRef>,
        };
        need.push(CA3);
    }

    return need;
}

function posAtFnReference(
    AhkFileData: TAhkFileData,
    active: vscode.Position,
    document: vscode.TextDocument,
): never[] | [vscode.CodeAction] {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        active,
        /(?<=[%!"/&'()*+,\-:;<=>?[\\^\]{|}~ \t]|^)[#$@\w\u{A1}-\u{FFFF}]+/u,
        // without .` and #$@
    );
    if (range === undefined) return [];

    const wordUp: string = ToUpCase(document.getText(range));
    const AhkTokenLine: TAhkTokenLine = AhkFileData.DocStrMap[active.line];

    const wordUpFix: string = getFucDefWordUpFix(AhkTokenLine, wordUp, active.character);

    const funcSymbol: CAhkFunc | null = getFuncWithName(wordUpFix);
    if (funcSymbol === null) return [];

    if (!posAtFnRef({ AhkTokenLine, position: active, wordUpFix })) {
        return [];
    }
    //
    const CA = new vscode.CodeAction('Goto func definition');
    CA.command = {
        title: 'Goto func definition',
        command: ECommand.CmdGotoFuncDef,
        tooltip: 'by neko-help dev tools',
        arguments: [
            AhkFileData.uri,
            active,
            funcSymbol,
        ] satisfies Parameters<typeof CmdGotoFuncDef>,
    };
    //
    return [CA];
}

export function otherCodeAction(
    AhkFileData: TAhkFileData,
    selection: vscode.Range | vscode.Selection,
    document: vscode.TextDocument,
): vscode.CodeAction[] {
    if (!(selection instanceof vscode.Selection)) return [];

    const { AST, DocStrMap } = AhkFileData;
    const { active } = selection;
    const ahkFn: CAhkFunc | undefined = getFileAllFunc.up(AST)
        .find((ahkFunc: CAhkFunc): boolean => ahkFunc.nameRange.contains(active));

    const need: vscode.CodeAction[] = [];

    const { CodeAction2GotoDefRef } = getConfig().customize;

    if (ahkFn !== undefined) {
        need.push(...atFnHead(ahkFn, AhkFileData, active, CodeAction2GotoDefRef));
    }

    if (ahkFn === undefined && CodeAction2GotoDefRef) {
        need.push(...posAtFnReference(AhkFileData, active, document));
    }

    const AhkTokenLine: TAhkTokenLine = DocStrMap[active.line];
    if (AhkTokenLine.detail.includes(EDetail.isDirectivesLine)) {
        need.push(...CodeActionIncludePath(active, AhkTokenLine, AhkFileData));
    }

    need.push(
        ...CodeActionAddGuiName(active, AhkTokenLine, AhkFileData),
        ...CodeActionCmdGetErrorLevel(active, AhkTokenLine, AhkFileData),
    );

    return need;
}

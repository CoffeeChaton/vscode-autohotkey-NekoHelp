import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { hoverAVar } from '../../tools/Built-in/A_Variables.tools';
import { hoverBiVar } from '../../tools/Built-in/BiVariables.tools';
import { getHoverCommand2 } from '../../tools/Built-in/Command.tools';
import { getBuiltInFuncMD } from '../../tools/Built-in/func.tools';
import { getHoverOtherKeyWord1 } from '../../tools/Built-in/otherKeyword1.tools';
import { getHoverOtherKeyWord2 } from '../../tools/Built-in/otherKeyword2.tools';
import { getHoverStatement } from '../../tools/Built-in/statement.tools';
import { hover2winMsgMd } from '../../tools/Built-in/Windows_Messages_Tools';
import { numberFindWinMsg } from '../../tools/Built-in/Windows_MessagesRe_Tools';
import { hoverWinTitleParam } from '../../tools/Built-in/WinTitle/WinTitleParameter.tools';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { getFucDefWordUpFix } from '../Def/getFucDefWordUpFix';
import { DeepAnalysisHover } from './tools/DeepAnalysisHover';
import { hoverAhk2exe } from './tools/hoverAhk2exe';
import { hoverClassName } from './tools/hoverClassName';
import { hoverDirectives } from './tools/hoverDirectives';
import { hoverGlobalVar } from './tools/hoverGlobalVar';
import { hoverGuiParam } from './tools/hoverGuiParam';
import { hoverLabel } from './tools/hoverLabel';
import { hoverLabelOrFunc } from './tools/hoverLabelFn';
import { hoverMultiLine } from './tools/hoverMultiLine';

function HoverOfFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`#%])\b\w+(?=\()/u);
    if (range === undefined) return null;

    const wordUp: string = document.getText(range).toUpperCase();
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
    if (position.character > lStr.length) return hoverAhk2exe(AhkTokenLine, position);

    // ex: #Warn
    const DirectivesMd: vscode.MarkdownString | undefined = hoverDirectives(position, AST);
    if (DirectivesMd !== undefined) return new vscode.Hover(DirectivesMd);

    const AhkFunc: CAhkFunc | null = getDAWithPos(AST, position);
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (AhkFunc !== null && AhkFunc.nameRange.contains(position)) {
        return new vscode.Hover(AhkFunc.md);
    }

    const haveFunc: vscode.MarkdownString | null = HoverOfFunc(document, position);
    if (haveFunc !== null) return new vscode.Hover(haveFunc);

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b(?!\()/u);
    if (range === undefined) return null;

    const wordUp: string = document.getText(range).toUpperCase();

    const ahkClassMd: vscode.MarkdownString | null = hoverClassName(AhkFileData, position, wordUp);
    if (ahkClassMd !== null) return new vscode.Hover(ahkClassMd);

    const labelMd: vscode.MarkdownString | null = hoverLabel(AhkFileData, position, wordUp);
    if (labelMd !== null) return new vscode.Hover(labelMd);
    const hoverLabelOrFuncMd: vscode.MarkdownString | null = hoverLabelOrFunc(
        AhkFileData,
        AhkTokenLine,
        wordUp,
        position,
    );
    if (hoverLabelOrFuncMd !== null) return new vscode.Hover(hoverLabelOrFuncMd);

    const guiParam: vscode.MarkdownString | null = hoverGuiParam(AhkTokenLine, position);
    if (guiParam !== null) return new vscode.Hover(guiParam);

    if (AhkFunc !== null) {
        const DAmd: vscode.MarkdownString | null = DeepAnalysisHover(AhkFunc, wordUp, position);
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
            getHoverOtherKeyWord1,
            getHoverOtherKeyWord2,
            getHoverStatement,
            hoverAVar,
            hoverWinTitleParam,
            hoverBiVar,
            hoverGlobalVar,
            hover2winMsgMd,
            numberFindWinMsg,
        ] as const satisfies readonly TFn[]
    ) {
        const md: vscode.MarkdownString | null | undefined = fn(wordUp);
        if (md !== undefined && md !== null) return new vscode.Hover(md);
    }

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

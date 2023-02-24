import * as path from 'node:path';
import * as vscode from 'vscode';
import type { TGValData } from '../../core/ParserTools/ahkGlobalDef';
import { EGlobalDefBy } from '../../core/ParserTools/ahkGlobalDef';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { fmtOutPutReport } from '../tools/fmtOutPutReport';

/**
 * valName ; ln99 global valName...
 */
type TMsg = {
    line: number,
    rawName: string,
    textRaw: string,
};
function getByGlobalLine(AhkFileData: TAhkFileData, set: Set<string>): readonly string[] {
    const { GValMap, DocStrMap } = AhkFileData;

    const arr: TMsg[] = [];
    for (const [k, { defRangeList }] of GValMap) {
        const find: TGValData | undefined = defRangeList
            .find(({ by }: TGValData): boolean => by === EGlobalDefBy.byGlobal);
        if (find !== undefined) {
            const { range, rawName } = find;
            const { line } = range.start;
            const { textRaw } = DocStrMap[line];
            arr.push({ line, rawName, textRaw });
            set.add(k);
        }
    }
    arr.sort((a: TMsg, b: TMsg): number => a.line - b.line);
    return arr.map(({ line, rawName, textRaw }: TMsg): string => `${line + 1} , ${rawName} ; ${textRaw.trim()}`);
}

function getByGuiDefGlobalVar(AhkFileData: TAhkFileData, set: Set<string>): readonly string[] {
    const { GValMap, DocStrMap } = AhkFileData;

    const arr: TMsg[] = [];
    for (const [k, { defRangeList }] of GValMap) {
        const find: TGValData | undefined = defRangeList
            .find(({ by }: TGValData): boolean => by === EGlobalDefBy.byGui);
        if (find !== undefined && !set.has(k)) { // <-----------------^^^^^
            const { range, rawName } = find;
            const { line } = range.start;
            const { textRaw } = DocStrMap[line];
            arr.push({ line, rawName, textRaw });
            set.add(k);
        }
    }
    arr.sort((a: TMsg, b: TMsg): number => a.line - b.line);
    return arr.map(({ line, rawName, textRaw }: TMsg): string => `${line + 1} , ${rawName} ; ${textRaw.trim()}`);
}

function getByDefModuleVar(AhkFileData: TAhkFileData, set: Set<string>): readonly string[] {
    const { ModuleVar, DocStrMap } = AhkFileData;

    const arr: TMsg[] = [];
    for (const [k, { defRangeList, keyRawName }] of ModuleVar.ModuleValMap) {
        if (!set.has(k)) {
            const { line } = defRangeList[0].start;
            const { textRaw } = DocStrMap[line];
            arr.push({ line, rawName: keyRawName, textRaw });
            set.add(k);
        }
    }
    arr.sort((a: TMsg, b: TMsg): number => a.line - b.line);
    return arr.map(({ line, rawName, textRaw }: TMsg): string => `${line + 1} , ${rawName} ; ${textRaw.trim()}`);
}

export async function cmd2TryFindGlobalVar(document: vscode.TextDocument): Promise<null> {
    const t1: number = Date.now();
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) {
        void vscode.window.showInformationMessage('neko-help not support ahk v2');
        return null;
    }

    /**
     * already registered
     *
     * @input UpName
     */
    const set = new Set<string>();
    const byGlobalLine: readonly string[] = getByGlobalLine(AhkFileData, set);
    const byGuiDef: readonly string[] = getByGuiDefGlobalVar(AhkFileData, set);
    const byModuleVar: readonly string[] = getByDefModuleVar(AhkFileData, set);

    const ms: number = Date.now() - t1;
    const content: string = [
        '',
        'Class Class_cmd3_try_find_global_Var',
        '{',
        '',
        `    static source := "${path.basename(document.uri.fsPath)}"`,
        `    static sourcePath := "${document.uri.fsPath}"`,
        '',
        '    byGlobalLine() {',
        '        ; by Global varName1,varName2`n',
        '        MsgBox, ',
        '            ( LTrim C',
        ...byGlobalLine.map((str: string): string => `                ${str}`),
        '            )',
        '    }',
        '',
        '    byGui() {',
        '        ; if use `Global` declaration , then hide with this block',
        '        ; Gui, Add, ListView, hwndOutPutVar vVarName',
        '        ; `n;                     ^^^^^^^^   ^^^^^^^',
        '        ; hwndOutPutVar -> OutPutVar ; https://www.autohotkey.com/docs/v1/lib/Gui.htm#Controls_Uncommon_Styles_and_Options',
        '        ; vVarName -> VarName ; https://www.autohotkey.com/docs/v1/lib/Gui.htm#Events',
        '        MsgBox, ',
        '            ( LTrim C ; if use `Global` declaration , then hide with this block',
        ...byGuiDef.map((str: string): string => `                ${str}`),
        '            )',
        '    }',
        '',
        '    maybeIsGlobal() {',
        '        ; maybe is Global',
        '        MsgBox, ',
        '            ( LTrim C ; if use `Global` or `Gui` declaration , then hide with this block',
        ...byModuleVar.map((str: string): string => `                ${str}`),
        '            )',
        '    }',
        '',
        '}',
        '',
        'MsgBox % Class_cmd3_try_find_global_Var.source ',
        '',
        'Class_cmd3_try_find_global_Var.byGlobalLine()',
        'Class_cmd3_try_find_global_Var.byGui()',
        'Class_cmd3_try_find_global_Var.maybeIsGlobal()',
        '',
        'MsgBox % "please use *ListVars* to check for global variables" ; https://www.autohotkey.com/docs/v1/lib/ListVars.htm',
        `MsgBox % "Done : " ${ms} " ms"`,
        '',
    ].join('\n');

    const docOut: vscode.TextDocument = await vscode.workspace.openTextDocument({
        language: 'ahk',
        content,
    });
    await fmtOutPutReport(docOut);
    await vscode.window.showTextDocument(docOut);
    return null;
}

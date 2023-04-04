/* eslint-disable max-lines-per-function */
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getFuncRef } from '../../provider/Def/getFnRef';
import { log } from '../../provider/vscWindows/log';
import { isAhkTab } from '../../tools/fsTools/isAhk';
import { getFileAllFunc } from '../../tools/visitor/getFileAllFuncList';
import { fmtOutPutReport } from '../tools/fmtOutPutReport';

type TRef = {
    Ref0: readonly string[],
    Ref1: readonly string[],
    RefN: readonly string[],
};

/**
 * Number of references for each function
 */
function getEachFnRefNumber(AhkFileData: TAhkFileData): TRef {
    const Ref0: string[] = [];
    const Ref1: string[] = [];
    const RefN: string[] = [];

    for (const funcSymbol of getFileAllFunc.up(AhkFileData.AST)) {
        const len: number = getFuncRef(funcSymbol).length - 1;
        const { name } = funcSymbol;
        switch (len) {
            case 0:
                Ref0.push(`${name}()`);
                break;

            case 1:
                Ref1.push(`${name}()`);
                break;

            default:
                RefN.push(`${name}() ; ${len}`);
                break;
        }
    }

    return {
        Ref0,
        Ref1,
        RefN,
    };
}

export async function AnalysisFuncRefCore(document: vscode.TextDocument): Promise<null> {
    const t1 = Date.now();
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) {
        void vscode.window.showInformationMessage('neko-help not support ahk v2');
        return null;
    }

    const { Ref0, Ref1, RefN } = getEachFnRefNumber(AhkFileData);
    const ms: number = Date.now() - t1;
    const content: string = [
        '',
        'Class Class_Report_fn_ref',
        '{',
        '',
        `    static source := "${path.basename(document.uri.fsPath)}"`,
        `    static sourcePath := "${document.uri.fsPath}"`,
        '',
        '    Ref0() {',
        '        MsgBox, ',
        '            ( LTrim',
        '                never user`n',
        // '                fnA()',
        ...Ref0,
        // '                fnC()',
        '            )',
        '    }',
        '',
        '    Ref1() {',
        '        MsgBox, ',
        '            ( LTrim',
        '                only used in 1 place`n',
        ...Ref1,
        '            )',
        '    }',
        '',
        '    RefMore() {',
        '        MsgBox, ',
        '            ( LTrim',
        '                RefMore`n',
        ...RefN,
        '            )',
        '    }',
        '}',
        '',
        'MsgBox % Class_Report_fn_ref.sourcePath ',
        '',
        'Class_Report_fn_ref.Ref0()',
        'Class_Report_fn_ref.Ref1()',
        'Class_Report_fn_ref.RefN()',
        '',
        `MsgBox % "Done : " ${ms} " ms"`,
        '',
    ].join('\r\n');

    const docOut: vscode.TextDocument = await vscode.workspace.openTextDocument({
        language: 'ahk',
        content,
    });
    await fmtOutPutReport(docOut);
    await vscode.window.showTextDocument(docOut);

    //  log.info(`AnalysisFuncReference of "${document.fileName}" , use ${ms} ms`);
    return null;
}

export function AnalysisFuncReferenceWrap(): null {
    //
    const visibleList: readonly vscode.TextEditor[] = vscode.window.visibleTextEditors;
    const visibleListAhk: readonly vscode.TextDocument[] = visibleList
        .filter(({ document }: vscode.TextEditor) => (document.languageId === 'ahk' && isAhkTab(document.uri)))
        .map(({ document }: vscode.TextEditor): vscode.TextDocument => document);

    if (visibleListAhk.length === 0) {
        void vscode.window.showInformationMessage('you don\'t open any ahk file');
    }
    if (visibleListAhk.length === 1) {
        void AnalysisFuncRefCore(visibleListAhk[0]);
        return null;
    }

    type TPick = {
        label: string,
        select: vscode.TextDocument,
    };

    const items: TPick[] = visibleListAhk.map((select: vscode.TextDocument, i: number): TPick => ({
        label: `${i} -> ${select.fileName}`,
        select,
    }));

    void vscode.window.showQuickPick<TPick>(items)
        .then((pick: TPick | undefined): null => {
            if (pick === undefined) return null;
            const { select } = pick;
            log.info(`select "${select.fileName}"`);
            void AnalysisFuncRefCore(select);
            return null;
        });
    return null;
}

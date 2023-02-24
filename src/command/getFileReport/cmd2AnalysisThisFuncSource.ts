/* eslint-disable max-lines-per-function */
import * as path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TFuncRef } from '../../provider/Def/getFnRef';
import { EFnRefBy, fileFuncRef } from '../../provider/Def/getFnRef';
import type { TBiFuncMsg } from '../../tools/Built-in/func.tools';
import { getBuiltInFuncMD } from '../../tools/Built-in/func.tools';
import type { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { getAllFunc } from '../../tools/Func/getAllFunc';
import { fmtOutPutReport } from '../tools/fmtOutPutReport';
import type {
    TRefBuiltInFn,
    TRefJustBy2,
    TRefUnknown,
    TRefUseDef,
} from './cm2Tools/allCmd2type';
import { BuiltInFn2StrList } from './cm2Tools/BuiltInFn2StrList';
import { mayUseByStr } from './cm2Tools/mayUseByStr';
import { refUseDef2StrList } from './cm2Tools/refUseDef2StrList';
import { unKnowSourceToStrList } from './cm2Tools/unKnowSourceToStrList';

export async function cmd2AnalysisThisFuncSource(document: vscode.TextDocument): Promise<null> {
    //
    const t1: number = Date.now();
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) {
        void vscode.window.showInformationMessage('neko-help not support ahk v2');
        return null;
    }

    const { DocStrMap } = AhkFileData;
    const refMap: ReadonlyMap<string, TFuncRef[]> = fileFuncRef.up(AhkFileData);
    const fnMap: TFullFuncMap = getAllFunc();

    const refUseDef: TRefUseDef = new Map();
    const refBuiltInFn: TRefBuiltInFn = new Map();
    const refJustBy2: TRefJustBy2 = new Map(); // by "funcName"
    const refJustBy2ButNotFindSource: TRefUnknown = new Map(); // by "funcName" but not found source
    const refUnknown: TRefUnknown = new Map();

    for (const [upFnName, RefList] of refMap) {
        const justByRef2: boolean = RefList.every((ref: TFuncRef): boolean => ref.by === EFnRefBy.wordWrap);
        const ahkFunc: CAhkFunc | undefined = fnMap.get(upFnName);
        if (ahkFunc !== undefined) {
            if (justByRef2) {
                refJustBy2.set(upFnName, [RefList, ahkFunc]);
            } else {
                /**
                 * FIXME: check Label-name .EQ. func-Name ....= =||
                 */
                refUseDef.set(upFnName, [RefList, ahkFunc]);
            }
            continue;
        }
        const BuiltInFnMsg: TBiFuncMsg | undefined = getBuiltInFuncMD(upFnName);
        if (BuiltInFnMsg !== undefined) {
            refBuiltInFn.set(upFnName, [RefList, BuiltInFnMsg]);
            continue;
        }
        if (justByRef2) {
            refJustBy2ButNotFindSource.set(upFnName, RefList);
        } else {
            refUnknown.set(upFnName, RefList);
        }
    }

    const ms: number = Date.now() - t1;
    const content: string = [
        '',
        'class cmd2_report_this_func_source { ',
        `static source := "${path.basename(document.uri.fsPath)}"`,
        `static sourcePath := "${document.uri.fsPath}"`,
        '',
        'unknownSource() {',
        '; Looks like a function, but I can\'t get the source of',
        ...unKnowSourceToStrList(DocStrMap, refUnknown),
        '}',
        '',
        'BuiltInFunc() {',
        '; https://www.autohotkey.com/docs/v1/Functions.htm#BuiltIn',
        ...BuiltInFn2StrList(DocStrMap, refBuiltInFn),
        '}',
        '',
        'fromUserDef() {',
        ...refUseDef2StrList(DocStrMap, refUseDef),
        '}',
        '',
        'strHasSameName() {',
        '; by "funcName" and has a function with the same name',
        ...mayUseByStr(DocStrMap, refJustBy2),
        '}',
        '',
        'mayUseByStr() {',
        '; by "funcName" , but not any function has same name',
        ...unKnowSourceToStrList(DocStrMap, refJustBy2ButNotFindSource),
        '}',
        '}',
        'MsgBox % "please read https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp#find-ref-of-function"',
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

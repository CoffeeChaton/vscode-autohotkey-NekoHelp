import * as path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../../AhkSymbol/TAhkSymbolIn';
import { getConfig, getSnippetBlockFilesList } from '../../../configUI';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { pm } from '../../../core/ProjectManager';
import { enumLog } from '../../../tools/enumErr';
import { fsPathIsAllow } from '../../../tools/fsTools/getUriList';
import { ToUpCase } from '../../../tools/str/ToUpCase';
import { getFileAllClass } from '../../../tools/visitor/getFileAllClassList';
import { getFileAllFunc } from '../../../tools/visitor/getFileAllFuncList';
import { CUserFnClassCompletion } from './CUserFnClassCompletion';

function setClassSnip(
    fileName: string,
    base0: string,
    AC: CAhkClass,
): CUserFnClassCompletion {
    const { name, insertText, upName } = AC;

    const item: CUserFnClassCompletion = new CUserFnClassCompletion(
        {
            label: name,
            description: fileName,
        },
        upName.startsWith(base0),
        // base0.startsWith(
        //     upName.includes('_')
        //         ? upName.replace(/_[^_]*$/u, '')
        //         : upName,
        // ),
        vscode.CompletionItemKind.Class,
    );

    item.insertText = insertText.replace(/^[#$@]/u, '');
    item.documentation = 'user def class';
    return item;
}

function setFuncSnip(
    fileName: string,
    base0: string,
    func: CAhkFunc,
): CUserFnClassCompletion {
    const {
        md,
        name,
        upName,
        selectionRangeText,
    } = func;

    const item: CUserFnClassCompletion = new CUserFnClassCompletion(
        {
            label: `${name}()`,
            description: fileName,
        },
        upName.startsWith(base0),
        // base0.startsWith(
        //     upName.includes('_')
        //         ? upName.replace(/_[^_]*$/u, '')
        //         : upName,
        // ),
        vscode.CompletionItemKind.Function,
    );

    item.insertText = selectionRangeText.replace(/^[#$@]/u, '');
    item.documentation = md;
    return item;
}

const wm = new WeakMap<TAstRoot, readonly CUserFnClassCompletion[]>();

function partSnip(AhkFileData: TAhkFileData): readonly CUserFnClassCompletion[] {
    const { AST, uri } = AhkFileData;
    const fileName: string = path.basename(uri.fsPath);
    const base0: string = ToUpCase(fileName.replace(/\.ah[1k]$/iu, ''));
    const cache: readonly CUserFnClassCompletion[] | undefined = wm.get(AST);
    if (cache !== undefined) {
        return cache;
    }

    const item: readonly CUserFnClassCompletion[] = [
        ...getFileAllFunc.up(AST)
            .map((ahkFunc: CAhkFunc): CUserFnClassCompletion => setFuncSnip(fileName, base0, ahkFunc)),
        ...getFileAllClass(AST)
            .map((ahkClass: CAhkClass): CUserFnClassCompletion => setClassSnip(fileName, base0, ahkClass)),
    ];

    wm.set(AST, item);
    return item;
}

function CompletionFixStartWithHash(subStr: string, item: CUserFnClassCompletion[]): CUserFnClassCompletion[] {
    if (subStr.startsWith('#') && !(/^#if\b/iu).test(subStr)) {
        return item.filter((v: CUserFnClassCompletion): boolean => v.label.label.includes('#'));
    }

    return item;
}

export function CompletionUserDefFuncClass(subStr: string, zeroAhkFileData: TAhkFileData): CUserFnClassCompletion[] {
    const filesBlockList: readonly RegExp[] = getSnippetBlockFilesList();

    const { fromOtherFile } = getConfig().snippets;

    if (fromOtherFile === 0) {
        return [...partSnip(zeroAhkFileData)];
    }

    const item: CUserFnClassCompletion[] = [];
    for (const AhkFileData of pm.DocMap.values()) { // keep output order is OK
        if (AhkFileData.uri.fsPath === zeroAhkFileData.uri.fsPath) continue;
        if (!fsPathIsAllow(AhkFileData.uri.fsPath.replaceAll('\\', '/'), filesBlockList)) continue;

        item.push(...partSnip(AhkFileData));
    }

    if (fromOtherFile === 1) {
        return CompletionFixStartWithHash(subStr, [
            ...partSnip(zeroAhkFileData),
            ...item,
        ]);
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (fromOtherFile === 2) {
        return CompletionFixStartWithHash(subStr, [
            ...partSnip(zeroAhkFileData),
            ...item
                .filter((CompletionItem: CUserFnClassCompletion): boolean => CompletionItem.isSatisfyOpt2),
        ]);
    }
    enumLog(fromOtherFile, 'CompletionUserDefFunc');

    return CompletionFixStartWithHash(subStr, [
        ...partSnip(zeroAhkFileData),
        ...item,
    ]);
}

import * as path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../../AhkSymbol/TAhkSymbolIn';
import { getSnippetBlockFilesList } from '../../../configUI';
import { pm } from '../../../core/ProjectManager';
import { fsPathIsAllow } from '../../../tools/fsTools/getUriList';
import { getFileAllClass } from '../../../tools/visitor/getFileAllClassList';
import { getFileAllFunc } from '../../../tools/visitor/getFileAllFuncList';

export class CUserFnClass extends vscode.CompletionItem {
    //
    declare public readonly label: vscode.CompletionItemLabel;

    public constructor(label: vscode.CompletionItemLabel) {
        super(label);
    }
}

function setClassSnip(
    fileName: string,
    AC: CAhkClass,
): CUserFnClass {
    const { name, insertText } = AC;

    const item: CUserFnClass = new CUserFnClass({
        label: name,
        description: fileName,
    });

    item.insertText = insertText.replace(/^[#$@]/u, '');
    item.detail = 'neko help';

    item.kind = vscode.CompletionItemKind.Class;
    item.documentation = 'user def class';
    return item;
}

function setFuncSnip(
    fileName: string,
    func: CAhkFunc,
): CUserFnClass {
    const { md, name, selectionRangeText } = func;

    const item: CUserFnClass = new CUserFnClass({
        label: `${name}()`,
        description: fileName,
    });

    item.insertText = selectionRangeText.replace(/^[#$@]/u, '');
    item.detail = 'neko help';

    item.kind = vscode.CompletionItemKind.Function;
    item.documentation = md;
    return item;
}

const wm = new WeakMap<TAstRoot, readonly CUserFnClass[]>();

function partSnip(AstRoot: TAstRoot, fileName: string): readonly CUserFnClass[] {
    const cache: readonly CUserFnClass[] | undefined = wm.get(AstRoot);
    if (cache !== undefined) {
        return cache;
    }

    const item: readonly CUserFnClass[] = [
        ...getFileAllFunc.up(AstRoot)
            .map((ahkFunc: CAhkFunc): CUserFnClass => setFuncSnip(fileName, ahkFunc)),
        ...getFileAllClass(AstRoot)
            .map((ahkClass: CAhkClass): CUserFnClass => setClassSnip(fileName, ahkClass)),
    ];

    wm.set(AstRoot, item);
    return item;
}

export function listAllFuncClass(subStr: string): CUserFnClass[] {
    const filesBlockList: readonly RegExp[] = getSnippetBlockFilesList();

    const item: CUserFnClass[] = [];
    for (const { uri, AST } of pm.DocMap.values()) { // keep output order is OK
        if (!fsPathIsAllow(uri.fsPath.replaceAll('\\', '/'), filesBlockList)) continue;

        item.push(...partSnip(AST, path.basename(uri.fsPath)));
    }

    if (subStr.startsWith('#') && !(/^#if\b/iu).test(subStr)) {
        return item.filter((v: CUserFnClass): boolean => v.label.label.includes('#'));
    }

    return item;
}

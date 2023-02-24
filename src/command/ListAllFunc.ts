import * as vscode from 'vscode';
import { pm } from '../core/ProjectManager';
import { msgWithPos } from './tools/msgWithPos';

function ListAllFunc(showLink: boolean): null {
    const t1: number = Date.now();

    const AllList: string[] = [];
    let funcHint = 0;
    let fileHint = 0;
    for (const { uri, AST } of pm.DocMap.values()) { // should keep output order
        AllList.push(`;${uri.fsPath}`);

        for (const DocumentSymbol of AST) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                const text = `${DocumentSymbol.name}()`;
                const textShow: string = showLink
                    ? msgWithPos(text, uri.fsPath, DocumentSymbol.selectionRange.start)
                    : text;
                AllList.push(textShow);
                funcHint++;
            }
        }
        AllList.push('');
        fileHint++;
    }

    void vscode.workspace.openTextDocument({
        language: 'ahk',
        content: [
            '; > "List All Function()"',
            ...AllList,
            '',
            'MsgBox,',
            '    ( LTrim',
            `        file: ${fileHint}`,
            `        func: ${funcHint}`,
            `        Done: ${Date.now() - t1} ms`,
            '    )',
        ].join('\n'),
    }).then((doc: vscode.TextDocument): Thenable<vscode.TextEditor> => vscode.window.showTextDocument(doc));

    return null;
}

function ListAllFuncSort(reverse: boolean): null {
    const t1: number = Date.now();

    const AllList: string[] = [];
    let funcHint = 0;
    let fileHint = 0;
    for (const { uri, AST } of pm.DocMap.values()) { // should keep output order
        for (const DocumentSymbol of AST) {
            if (DocumentSymbol.kind === vscode.SymbolKind.Function) {
                AllList.push(msgWithPos(`${DocumentSymbol.name}()`, uri.fsPath, DocumentSymbol.selectionRange.start));
                funcHint++;
            }
        }
        fileHint++;
    }

    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    AllList.sort(); // a->z

    if (reverse) AllList.reverse();
    const re = reverse
        ? 'z -> a'
        : 'a -> z';

    void vscode.workspace.openTextDocument({
        language: 'ahk',
        content: [
            `> "List All Function(), Sort with ${re} "`,
            ...AllList,
            '',
            'MsgBox,',
            '    ( LTrim',
            `        file: ${fileHint}`,
            `        func: ${funcHint}`,
            `        Done: ${Date.now() - t1} ms`,
            '    )',
        ].join('\n'),
    }).then((doc: vscode.TextDocument): Thenable<vscode.TextEditor> => vscode.window.showTextDocument(doc));

    return null;
}

export function ListAllFuncMain(): void {
    type TCommand = {
        label: string,
        fn: () => void,
    };

    const items: TCommand[] = [
        { label: '1 -> list all Function()', fn: (): null => ListAllFunc(false) },
        { label: '2 -> list all Function() ; link', fn: (): null => ListAllFunc(true) },
        { label: '3 -> list all Function() sort a -> z', fn: (): null => ListAllFuncSort(false) },
        { label: '4 -> list all Function() sort z -> a', fn: (): null => ListAllFuncSort(true) },
    ];

    void vscode.window.showQuickPick<TCommand>(items)
        .then((pick: TCommand | undefined): void => pick?.fn());
}

// file: 29
// func: 665
// Done in 0 ms

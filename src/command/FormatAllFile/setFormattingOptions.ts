/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4,5,6,7,8] }] */

import * as vscode from 'vscode';

export async function setFormattingOptions(): Promise<vscode.FormattingOptions | null> {
    type TSelectTabOrSpace = {
        label: string,
        useTabs: boolean,
    };

    const TabOrSpacePick: TSelectTabOrSpace | undefined = await vscode.window.showQuickPick<TSelectTabOrSpace>([
        { label: '1 -> indent Using Tabs', useTabs: true },
        { label: '2 -> indent Using Spaces', useTabs: false },
    ], { title: 'Select Formatting Options' });

    if (TabOrSpacePick === undefined) {
        return null;
    }

    if (TabOrSpacePick.useTabs) { // Tab
        return {
            tabSize: 0,
            insertSpaces: false,
        };
    }

    type TSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    type TTabSize = {
        label: `${TSize}`,
        size: TSize,
        description?: '(suggest)',
    };

    const sizePick: TTabSize | undefined = await vscode.window.showQuickPick<TTabSize>([
        { label: '1', size: 1 },
        { label: '2', size: 2 },
        { label: '3', size: 3 },
        { label: '4', size: 4, description: '(suggest)' },
        { label: '5', size: 5 },
        { label: '6', size: 6 },
        { label: '7', size: 7 },
        { label: '8', size: 8 },
    ], { title: 'set format ident size' });
    if (sizePick === undefined) {
        return null;
    }

    return {
        tabSize: sizePick.size,
        insertSpaces: true,
    };
}

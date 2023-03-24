import * as vscode from 'vscode';
import { generateAhkNekoSnapshot } from './generateAhkNekoSnapshot';
import { pressureTest } from './pressureTest';

export function A1DevTools(): void {
    type TPick = {
        label: string,
        fn: () => void,
    };

    void vscode.window.showQuickPick<TPick>([
        { label: '0 -> pressureTest ', fn: pressureTest },
        { label: '1 -> generate snapshot', fn: generateAhkNekoSnapshot },
    ])
        .then((pick: TPick | undefined): null => {
            //
            pick?.fn();
            return null;
        });
}

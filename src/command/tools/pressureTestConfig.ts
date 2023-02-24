import * as vscode from 'vscode';

export type TPickReturn = {
    label: string,
    cycles: number,
};

export function pressureTestConfig(): Thenable<TPickReturn | undefined> {
    const items: TPickReturn[] = [
        {
            label: '20 cycles',
            cycles: 20,
        },
        {
            label: '80 cycles',
            cycles: 80,
        },
    ];

    return vscode.window.showQuickPick<TPickReturn>(items);
}

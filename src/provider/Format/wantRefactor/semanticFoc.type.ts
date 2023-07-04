import type * as vscode from 'vscode';

export type TSemanticFoc = Readonly<{
    nameUp: string,
    /**
     * `ifIn`
     */
    nameEx: string,
    calcRange: boolean,
    case: string,
    range: vscode.Range,
}>;

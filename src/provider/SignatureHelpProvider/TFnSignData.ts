import type * as vscode from 'vscode';

export type TFnSignData = {
    SignInfo: vscode.SignatureInformation,
    paramLength: number,
    lastIsVariadic: boolean,
};

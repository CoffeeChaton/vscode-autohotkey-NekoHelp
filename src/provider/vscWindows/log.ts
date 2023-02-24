import * as vscode from 'vscode';

export const log: vscode.LogOutputChannel = vscode.window.createOutputChannel('AHK Neko Help', { log: true });
log.clear(); // clear old OutputChannel... vscode workbench.action.reloadWindow ...while not clear this...
log.info('Extension active!');

let fmtLogNull: vscode.LogOutputChannel | null = null;
export const fmtLog = {
    info(value: string): void {
        if (fmtLogNull === null) {
            fmtLogNull = vscode.window.createOutputChannel('AHK Neko Help [Format-log]', { log: true });
            fmtLogNull.info('fmt log active!');
        }
        fmtLogNull.info(value);
    },
};

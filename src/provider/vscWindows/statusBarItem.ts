import * as vscode from 'vscode';

export const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    'ahk-neko-help',
    vscode.StatusBarAlignment.Right,
);
statusBarItem.tooltip = 'by CoffeeChaton/vscode-autohotkey-NekoHelp';
statusBarItem.command = 'ahk.nekoHelp.bar';

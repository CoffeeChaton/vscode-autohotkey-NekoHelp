import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import type { TCmdMsg } from '../../tools/Built-in/6_command/Command.tools';
import { CommandMDMap } from '../../tools/Built-in/6_command/Command.tools';
import { CMemo } from '../../tools/CMemo';

function signToText(sign: 'E' | 'I' | 'O' | 'S'): 'InputVar' | 'Number' | 'OutputVar' | 'Text' {
    if (sign === 'S') return 'Text';
    if (sign === 'E') return 'Number';
    if (sign === 'O') return 'OutputVar';
    return 'InputVar';
}

const CmdSignMemo = new CMemo<TCmdMsg, vscode.SignatureInformation | null>(
    ({ md, _param, keyRawName }: TCmdMsg): vscode.SignatureInformation | null => {
        if (_param === undefined) return null;

        const parameters: vscode.ParameterInformation[] = [new vscode.ParameterInformation(keyRawName, md)];
        let label: string = keyRawName;
        let isFirstOption = 0;
        for (const commandParams of _param) {
            const {
                name,
                sign,
                isOpt,
                paramDoc,
            } = commandParams;
            if (isOpt) {
                isFirstOption++;
            }
            label += isFirstOption === 1
                ? ` [, ${name}`
                : `, ${name}`;

            const paramDocMd: vscode.MarkdownString = new vscode.MarkdownString(`${signToText(sign)}\n`, true)
                .appendMarkdown(`\n${paramDoc.join('\n')}`);

            parameters.push(new vscode.ParameterInformation(name, paramDocMd));
        }

        if (isFirstOption > 0) {
            label += ']';
        }

        const SignInfo = new vscode.SignatureInformation(label);
        SignInfo.parameters = parameters;
        return SignInfo;
    },
);

export function SignatureCmd(AhkFileData: TAhkFileData, position: vscode.Position): vscode.SignatureHelp | null {
    const { line, character } = position;
    const AhkTokenLine: TAhkTokenLine = AhkFileData.DocStrMap[line];
    const { fistWordUp, fistWordUpCol, lStr } = AhkTokenLine;

    if (fistWordUp === '') return null;

    const cmdData: TCmdMsg | undefined = CommandMDMap.get(fistWordUp);
    if (cmdData === undefined) return null;

    const SignInfo: vscode.SignatureInformation | null = CmdSignMemo.up(cmdData);
    if (SignInfo === null) return null;

    const strF: string = lStr
        .slice(fistWordUpCol + fistWordUp.length)
        .replace(/^\s*,?\s*/u, `${fistWordUp},`)
        .padStart(lStr.length, ' ');

    let comma = 0;

    let brackets1 = 0; // ()
    let brackets2 = 0; // []
    let brackets3 = 0; // {}

    for (let i = fistWordUpCol; i < character; i++) {
        const s: string = strF[i];
        switch (s) {
            case '(':
                brackets1++;
                break;
            case ')':
                brackets1--;
                break;

            case '[':
                brackets2++;
                break;
            case ']':
                brackets2--;
                break;

            case '{':
                brackets3++;
                break;
            case '}':
                brackets3--;
                break;
            default:
                break;
        }

        if (brackets1 > 0 || brackets2 > 0 || brackets3 > 0) continue;

        if (s === ',') {
            comma++;
        }
    }

    const Signature = new vscode.SignatureHelp();
    Signature.signatures = [SignInfo];
    Signature.activeSignature = 0;
    Signature.activeParameter = comma;
    return Signature;
}

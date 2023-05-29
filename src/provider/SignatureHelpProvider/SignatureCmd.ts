import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import type { TCmdMsg } from '../../tools/Built-in/6_command/Command.tools';
import { CommandMDMap } from '../../tools/Built-in/6_command/Command.tools';
import { CMemo } from '../../tools/CMemo';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { SignatureCmdOverloadArr } from './SignatureCmdOverload';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function signToText(sign: 'E' | 'I' | 'O' | 'S') {
    if (sign === 'S') return '[**Text**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
    if (sign === 'E') return '[**Number**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
    if (sign === 'O') {
        return '[**OutputVar**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
    }
    return '[**InputVar**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
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

            const paramDocMd: vscode.MarkdownString = new vscode.MarkdownString(signToText(sign), true)
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

    const Signature: vscode.SignatureHelp = new vscode.SignatureHelp();
    Signature.signatures = [SignInfo];
    Signature.activeSignature = 0;
    Signature.activeParameter = comma;

    for (
        const cmdDataOverload of SignatureCmdOverloadArr
            .filter((v): boolean => ToUpCase(v.keyRawName) === fistWordUp)
    ) {
        const SignInfoOverload: vscode.SignatureInformation | null = CmdSignMemo.up(cmdDataOverload);
        if (SignInfoOverload !== null) {
            Signature.signatures.push(SignInfoOverload);
        }
    }

    return Signature;
}

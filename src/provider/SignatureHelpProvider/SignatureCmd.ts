import * as vscode from 'vscode';
import { getSignatureHelp } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import type { TCmdMsg } from '../../tools/Built-in/6_command/Command.tools';
import { CommandMDMap } from '../../tools/Built-in/6_command/Command.tools';
import { CMemo } from '../../tools/CMemo';
import { SignatureCmdOverloadMap } from './SignatureCmdOverload';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function signToText(sign: 'E' | 'I' | 'O' | 'S') {
    if (sign === 'S') return '[**Text**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
    if (sign === 'E') return '[**Number**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
    if (sign === 'O') {
        return '[**OutputVar**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
    }
    return '[**InputVar**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
}

type TCmdSign = Readonly<{
    label: string,
    paramAList: vscode.ParameterInformation[],
    paramBList: vscode.ParameterInformation[],
}>;

const CmdSignMemo = new CMemo<TCmdMsg, TCmdSign | null>(
    ({ md, _param, keyRawName }: TCmdMsg): TCmdSign | null => {
        const head: vscode.ParameterInformation = new vscode.ParameterInformation(keyRawName, md);
        const paramAList: vscode.ParameterInformation[] = [head];
        const paramBList: vscode.ParameterInformation[] = [head];

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

            const signText = signToText(sign);
            //
            const A: vscode.MarkdownString = new vscode.MarkdownString(signText, true);
            paramAList.push(new vscode.ParameterInformation(name, A));

            const B: vscode.MarkdownString = new vscode.MarkdownString(signText, true)
                .appendMarkdown(`\n${paramDoc.join('\n')}`);
            paramBList.push(new vscode.ParameterInformation(name, B));
        }

        if (isFirstOption > 0) {
            label += ']';
        }

        return {
            label,
            paramAList,
            paramBList,
        };
    },
);

function getSignInfo(CmdSign: TCmdSign): vscode.SignatureInformation {
    const { label, paramAList, paramBList } = CmdSign;
    const SignInfo = new vscode.SignatureInformation(label);
    SignInfo.parameters = getSignatureHelp().CmdShowParamInfo
        ? paramBList
        : paramAList;

    return SignInfo;
}

export function SignatureCmd(AhkFileData: TAhkFileData, position: vscode.Position): vscode.SignatureHelp | null {
    const { line, character } = position;
    const AhkTokenLine: TAhkTokenLine = AhkFileData.DocStrMap[line];
    const { fistWordUp, fistWordUpCol, lStr } = AhkTokenLine;

    if (fistWordUp === '') return null;

    const cmdData: TCmdMsg | undefined = CommandMDMap.get(fistWordUp);
    if (cmdData === undefined) return null;

    const CmdSign: TCmdSign | null = CmdSignMemo.up(cmdData);
    if (CmdSign === null) return null;

    const strF: string = lStr
        .slice(fistWordUpCol + fistWordUp.length)
        .replace(/^\s*,?\s*/u, `${cmdData.keyRawName},`)
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
    Signature.signatures = [getSignInfo(CmdSign)];
    Signature.activeSignature = 0;
    Signature.activeParameter = comma;

    let j = 0;
    for (const v of SignatureCmdOverloadMap.get(fistWordUp) ?? []) {
        const CmdSignOverload: TCmdSign | null = CmdSignMemo.up(v);
        if (CmdSignOverload !== null) {
            Signature.signatures.push(getSignInfo(CmdSignOverload));
            j++;
        }
    }

    if (j > 0) {
        let activeSignature = 0;

        for (const v of Signature.signatures) {
            if (v.parameters.length - 1 < comma) {
                activeSignature++;
            } else {
                break;
            }
        }
        Signature.activeSignature = activeSignature;
    }

    return Signature;
}

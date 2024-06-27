import * as vscode from 'vscode';
import { getConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import type { TCmdMsg } from '../../tools/Built-in/6_command/Command.tools';
import { Cmd_MDMap } from '../../tools/Built-in/6_command/Command.tools';
import { CMemo } from '../../tools/CMemo';
import { enumLog } from '../../tools/enumErr';
import { SignatureCmdOverloadMap } from './SignatureCmdOverload';

function signToText(sign: 'E' | 'I' | 'O' | 'S'): `[**${string}` {
    // dprint-ignore
    switch (sign) {
        case 'E': return '[**Number**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
        case 'I': return '[**InputVar**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
        case 'O': return '[**OutputVar**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
        case 'S': return '[**Text**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
        default:
            enumLog(sign, 'signToText');
            return '[**Text**](https://www.autohotkey.com/docs/v1/Language.htm#commands)\n';
    }
}

type TCmdSign = Readonly<{
    cmdSignLabel: string,
    paramAList: vscode.ParameterInformation[],
    paramBList: vscode.ParameterInformation[],
}>;

const CmdSignMemo = new CMemo<TCmdMsg, TCmdSign>(
    ({
        _param,
        cmdSignLabel,
        keyRawName,
        md,
    }: TCmdMsg): TCmdSign => {
        const head: vscode.ParameterInformation = new vscode.ParameterInformation(keyRawName, md);
        const paramAList: vscode.ParameterInformation[] = [head];
        const paramBList: vscode.ParameterInformation[] = [head];

        for (const commandParams of _param) {
            const { name, paramDoc, sign } = commandParams;

            const signText = signToText(sign);
            //
            paramAList.push(
                new vscode.ParameterInformation(
                    name,
                    new vscode.MarkdownString(signText, true),
                ),
            );

            paramBList.push(
                new vscode.ParameterInformation(
                    name,
                    new vscode.MarkdownString(signText, true)
                        .appendMarkdown(`\n${paramDoc.join('\n')}`),
                ),
            );
        }

        return {
            cmdSignLabel,
            paramAList,
            paramBList,
        };
    },
);

function getSignInfo(CmdSign: TCmdSign): vscode.SignatureInformation {
    const { cmdSignLabel, paramAList, paramBList } = CmdSign;
    const SignInfo = new vscode.SignatureInformation(cmdSignLabel);
    SignInfo.parameters = getConfig().signatureHelp.CmdShowParamInfo
        ? paramBList
        : paramAList;

    return SignInfo;
}

function getSingCmdStrF(lStr: string, col: number): string {
    const str0: string = lStr.slice(col);

    if (str0.trimStart().startsWith(',')) {
        // happy path
        return str0.padStart(lStr.length, ' ');
    }

    // not happy
    return (`,${str0.replace(/^[ \\t]/u, '')}`)
        .padStart(lStr.length, ' ');
}

type TCmdData = { keyUp: string, keyCol: number, CmdSign: TCmdSign };

function getCmdData(AhkTokenLine: TAhkTokenLine): TCmdData | null {
    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;

    if (fistWordUp === '') return null;

    const cmdData: TCmdMsg | undefined = Cmd_MDMap.get(fistWordUp);
    if (cmdData === undefined) {
        if (SecondWordUp === '') return null;
        const cmdData2: TCmdMsg | undefined = Cmd_MDMap.get(SecondWordUp);
        if (cmdData2 === undefined) return null;

        const CmdSign2: TCmdSign | null = CmdSignMemo.up(cmdData2);

        return {
            keyUp: SecondWordUp,
            keyCol: SecondWordUpCol,
            CmdSign: CmdSign2,
        };
    }

    const CmdSign1: TCmdSign | null = CmdSignMemo.up(cmdData);
    return {
        keyUp: fistWordUp,
        keyCol: fistWordUpCol,
        CmdSign: CmdSign1,
    };
}

export function SignatureCmd(AhkFileData: TAhkFileData, position: vscode.Position): vscode.SignatureHelp | null {
    const { line, character } = position;
    const AhkTokenLine: TAhkTokenLine = AhkFileData.DocStrMap[line];

    const cmdData: TCmdData | null = getCmdData(AhkTokenLine);
    if (cmdData === null) return null;
    const {
        keyUp,
        keyCol,
        CmdSign,
    } = cmdData;

    if (character < keyCol) return null;

    const { lStr } = AhkTokenLine;
    const strF: string = getSingCmdStrF(lStr, keyCol + keyUp.length);

    let comma = 0;
    let brackets1 = 0; // ()
    let brackets2 = 0; // []
    let brackets3 = 0; // {}

    for (let i = keyCol; i < character; i++) {
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
    for (const v of SignatureCmdOverloadMap.get(keyUp) ?? []) {
        Signature.signatures.push(getSignInfo(CmdSignMemo.up(v)));
        j++;
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

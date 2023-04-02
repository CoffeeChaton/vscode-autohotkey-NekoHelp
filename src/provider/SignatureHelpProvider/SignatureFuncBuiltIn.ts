import * as vscode from 'vscode';
import type { TBiFuncMsg } from '../../tools/Built-in/func.tools';
import { CMemo } from '../../tools/CMemo';

const BiFuncSign = new CMemo<TBiFuncMsg, vscode.SignatureInformation>(
    (md: TBiFuncMsg): vscode.SignatureInformation => {
        const { sign } = md;

        const parameters: vscode.ParameterInformation[] = sign
            .replace(/^\w+\(/u, '')
            .replace(/\)$/u, '')
            .replaceAll(/[[\]]/gu, '')
            .split(',')
            .map((s: string): vscode.ParameterInformation => new vscode.ParameterInformation(s.trim()));

        const SignatureInformation = new vscode.SignatureInformation(sign);
        SignatureInformation.parameters = parameters;

        return SignatureInformation;
    },
);

export function SignBiFn(buildInFn: TBiFuncMsg, comma: number): vscode.SignatureHelp | null {
    const SignatureInformation = BiFuncSign.up(buildInFn);
    const Signature = new vscode.SignatureHelp();
    Signature.signatures = [SignatureInformation];
    Signature.activeSignature = 0;
    Signature.activeParameter = comma;
    return Signature;
}

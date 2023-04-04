import * as vscode from 'vscode';
import type { TBiFuncMsg } from '../../tools/Built-in/func.tools';
import { CMemo } from '../../tools/CMemo';
import type { TFnSignData } from './TFnSignData';

const BiFuncSign = new CMemo<TBiFuncMsg, TFnSignData>(
    (md: TBiFuncMsg): TFnSignData => {
        const { sign } = md;

        const paramList: readonly string[] = sign
            .replace(/^\w+\(/u, '')
            .replace(/\)$/u, '')
            .replaceAll('[', '')
            .replaceAll(']', '')
            .split(',')
            .map((s: string): string => (
                s
                    .replace(/^\s*ByRef\s*/u, '')
                    .replace(/:=.*/u, '')
                    .trim()
            ));

        const parameters: vscode.ParameterInformation[] = paramList
            .map((s: string): vscode.ParameterInformation => new vscode.ParameterInformation(s.trim()));
        // vscode.ParameterInformation[]
        const { length } = paramList;
        const last: string | undefined = paramList.at(-1);
        const lastIsVariadic: boolean = last?.endsWith('*') ?? false;

        const SignInfo = new vscode.SignatureInformation(sign, 'build-in func');
        SignInfo.parameters = parameters;

        return {
            SignInfo,
            paramLength: length,
            lastIsVariadic,
        };
    },
);

export function SignBiFn(buildInFn: TBiFuncMsg, comma: number): vscode.SignatureHelp | null {
    const { SignInfo, paramLength, lastIsVariadic } = BiFuncSign.up(buildInFn);

    const commaFix: number = comma >= paramLength - 1 && lastIsVariadic
        ? paramLength - 1
        : comma;

    const Signature = new vscode.SignatureHelp();
    Signature.signatures = [SignInfo];
    Signature.activeSignature = 0;
    Signature.activeParameter = commaFix;
    return Signature;
}

import * as path from 'node:path';
import * as vscode from 'vscode';
import type { CAhkFunc, TParamMetaOut } from '../../AhkSymbol/CAhkFunc';
import { CMemo } from '../../tools/CMemo';
import { getLStr } from '../../tools/str/removeSpecialChar';
import type { TFnSignData } from './TFnSignData';

function SignatureFuncSnipText2Sign(selectionRangeText: string): string {
    const arr0: readonly string[] = selectionRangeText.split('\n');
    const arr1: string[] = [];

    for (const str of arr0) {
        arr1.push(
            (/[\t ];/u).test(str)
                ? str.slice(0, getLStr(str).length)
                : str,
        );
    }

    return arr1.join('\n').trim();
}

const UserFuncSign = new CMemo<CAhkFunc, TFnSignData>(
    (fnSymbol: CAhkFunc): TFnSignData => {
        const {
            paramMap,
            selectionRangeText,
            uri,
        } = fnSymbol;

        const paramList: TParamMetaOut[] = [...paramMap.values()];
        const parameters: vscode.ParameterInformation[] = paramList
            .map(({ keyRawName }: TParamMetaOut): vscode.ParameterInformation => (
                new vscode.ParameterInformation(keyRawName)
            ));

        const { length } = paramList;
        const last: TParamMetaOut | undefined = paramList.at(-1);
        const lastIsVariadic: boolean = last?.isVariadic ?? false;
        const label0: string = selectionRangeText.includes('\n')
            ? SignatureFuncSnipText2Sign(selectionRangeText)
            : selectionRangeText;

        const { fsPath } = uri;
        const fileName: string = path.basename(fsPath);

        const doc: vscode.MarkdownString = new vscode.MarkdownString(`fn from *${fileName}*`);
        const SignInfo = new vscode.SignatureInformation(label0, doc);
        SignInfo.parameters = parameters;

        return {
            SignInfo,
            paramLength: length,
            lastIsVariadic,
        };
    },
);

export function SignUserFn(fnSymbol: CAhkFunc, comma: number): vscode.SignatureHelp | null {
    const { SignInfo, paramLength, lastIsVariadic } = UserFuncSign.up(fnSymbol);
    const commaFix: number = comma >= paramLength - 1 && lastIsVariadic
        ? paramLength - 1
        : comma;

    const Signature = new vscode.SignatureHelp();
    Signature.signatures = [SignInfo];
    Signature.activeSignature = 0;
    Signature.activeParameter = commaFix;
    return Signature;
}

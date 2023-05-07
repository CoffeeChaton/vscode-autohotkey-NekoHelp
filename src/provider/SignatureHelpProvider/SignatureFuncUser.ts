/* eslint-disable max-depth */
/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import type { CAhkFunc, TParamMetaOut } from '../../AhkSymbol/CAhkFunc';
import { getCustomize } from '../../configUI';
import { CMemo } from '../../tools/CMemo';
import { getFuncAhkDocData } from '../../tools/Func/getFuncAhkDocData';
import { getLStr } from '../../tools/str/removeSpecialChar';
import { ToUpCase } from '../../tools/str/ToUpCase';
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
            name,
        } = fnSymbol;
        const { returnList, ahkDocMeta } = fnSymbol.getMeta();

        const { paramSignMap, returnSign } = getFuncAhkDocData(fnSymbol);

        // eslint-disable-next-line no-magic-numbers
        const style: 0 | 1 | 2 | 3 = getCustomize().signatureHelp;

        const paramList: TParamMetaOut[] = [...paramMap.values()];
        const parameters: vscode.ParameterInformation[] = paramList
            .map(({ keyRawName }: TParamMetaOut): vscode.ParameterInformation => (
                new vscode.ParameterInformation(
                    keyRawName,
                    style > 0
                        ? paramSignMap.get(ToUpCase(keyRawName))
                        : undefined,
                )
            ));

        const { length } = paramList;
        const last: TParamMetaOut | undefined = paramList.at(-1);
        const lastIsVariadic: boolean = last?.isVariadic ?? false;
        const label0: string = selectionRangeText.includes('\n')
            ? SignatureFuncSnipText2Sign(selectionRangeText)
            : selectionRangeText;

        const label1: string = returnSign === '' || style > 0
            ? label0
            : `${returnSign} := ${label0}`;

        const doc: vscode.MarkdownString = new vscode.MarkdownString('', true);

        if (style >= 2) {
            doc.appendCodeblock(
                `${name}(...)${
                    getCustomize().HoverFunctionDocStyle === 1
                        ? ''
                        : '\n'
                }{\n${
                    returnList
                        .join('\n')
                }\n}`,
                'ahk',
            );

            const { otherMeta } = ahkDocMeta;
            if (style === 3 && otherMeta.length > 0) {
                doc
                    .appendMarkdown('\n***\n')
                    .appendMarkdown(otherMeta.join('\n'));
            }
        }

        const SignInfo = new vscode.SignatureInformation(label1, doc);
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

/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3] }] */
import * as vscode from 'vscode';
import type {
    CAhkFunc,
    TFnParamMeta,
    TParamMetaOut,
} from '../../AhkSymbol/CAhkFunc';
import { getCustomize } from '../../configUI';
import type { DeepReadonly } from '../../globalEnum';
import { CMemo } from '../../tools/CMemo';
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

type TParamMetaMap = ReadonlyMap<string, TFnParamMeta>;
function fixParamWithTypeStr(k: string, ParamMetaOut: TParamMetaOut, paramMetaMap: TParamMetaMap): string {
    const { keyRawName, isByRef, isVariadic } = ParamMetaOut;

    const p1: string = isVariadic
        ? `${keyRawName}*`
        : keyRawName;

    const p2: string = isByRef
        ? `ByRef ${p1}`
        : p1;

    const paramType: TFnParamMeta | undefined = paramMetaMap.get(k);
    return paramType === undefined || paramType.ATypeDef === ''
        ? p2
        : `${p2}: ${paramType.ATypeDef}`;
}

function getLabelWithType(
    InsertType: boolean,
    style: 0 | 1 | 2 | 3,
    fnSymbol: CAhkFunc,
): { parameters: vscode.ParameterInformation[], label: string } {
    const {
        paramMap,
        name,
        selectionRangeText,
        meta,
    } = fnSymbol;

    const { ahkDocMeta, returnList } = meta;
    const { paramMeta, returnMeta } = ahkDocMeta;

    const paramMetaMap: TParamMetaMap = new Map(paramMeta
        .map((v: TFnParamMeta): [string, DeepReadonly<TFnParamMeta>] => [ToUpCase(v.BParamName), v]));

    if (!InsertType) {
        const parameters: vscode.ParameterInformation[] = [];
        for (const [k, { keyRawName }] of paramMap) {
            const paramLabel: string = keyRawName;

            const paramType: TFnParamMeta | undefined = style > 0
                ? paramMetaMap.get(k)
                : undefined;

            const documentationFix: string | undefined = paramType === undefined
                ? undefined
                : paramType.CInfo.join('\n');

            const mdParam: vscode.MarkdownString = new vscode.MarkdownString(documentationFix, true);
            mdParam.supportHtml = true;

            parameters.push(
                new vscode.ParameterInformation(
                    paramLabel,
                    mdParam,
                ),
            );
        }
        return {
            parameters,
            label: SignatureFuncSnipText2Sign(selectionRangeText),
        };
    }

    const parameters: vscode.ParameterInformation[] = [];
    const paramList: string[] = [];
    for (const [k, ParamMetaOut] of paramMap) {
        const paramLabel: string = fixParamWithTypeStr(k, ParamMetaOut, paramMetaMap);
        paramList.push(paramLabel);

        const documentation: string | undefined = style > 0
            ? paramMetaMap.get(k)?.CInfo.join('\n')
            : undefined;

        const mdParam: vscode.MarkdownString = new vscode.MarkdownString(documentation, true);
        mdParam.supportHtml = true;

        parameters.push(
            new vscode.ParameterInformation(
                paramLabel,
                mdParam,
            ),
        );
    }

    const returnType: string = returnList.length > 0 || returnMeta.typeDef !== ''
        ? `: ${
            returnMeta.typeDef === ''
                ? 'unknown'
                : returnMeta.typeDef
        }`
        : '';

    return {
        parameters,
        label: `${name}(${paramList.join(', ')})${returnType}`,
    };
}

function UserFuncSignCore(fnSymbol: CAhkFunc): TFnSignData {
    const {
        paramMap,
        name,
        meta,
    } = fnSymbol;

    const style: 0 | 1 | 2 | 3 = getCustomize().signatureHelp;
    const InsertType: boolean = getCustomize().signatureHelpInsertType;

    const paramList: TParamMetaOut[] = [...paramMap.values()];

    const { length } = paramList;
    const lastIsVariadic: boolean = paramList.at(-1)?.isVariadic ?? false;

    const { parameters, label } = getLabelWithType(InsertType, style, fnSymbol);

    const doc: vscode.MarkdownString = new vscode.MarkdownString('', true);
    doc.supportHtml = true;

    if (style >= 2) {
        const { returnList, ahkDocMeta } = meta;

        const { info, typeDef } = ahkDocMeta.returnMeta;
        if (info.length > 0 || typeDef !== '') {
            if (info.length > 0 && typeDef !== '') {
                doc.appendMarkdown(
                    InsertType
                        ? `_@returns_ - ${info.join('\n')}`
                        : `_@returns_ {${typeDef}} - ${info.join('\n')}`,
                );
            }
        } else {
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
        }

        const { otherMeta } = ahkDocMeta;
        if (style === 3) {
            doc.appendMarkdown(
                otherMeta
                    .map((v: string): string => {
                        if ((/^[ \t]*@\w+[ \t]/u).test(v)) {
                            return v.replace(
                                /^[ \t]*@\w+[ \t]/u,
                                (match: string): string => `_${match.trim()}_ — `,
                            );
                        }
                        return v;
                    }).join('\n'),
            );
        }
    }

    const SignInfo = new vscode.SignatureInformation(label, doc);
    SignInfo.parameters = parameters;

    return {
        SignInfo,
        paramLength: length,
        lastIsVariadic,
    };
}

const UserFuncSign = new CMemo<CAhkFunc, TFnSignData>(UserFuncSignCore);

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

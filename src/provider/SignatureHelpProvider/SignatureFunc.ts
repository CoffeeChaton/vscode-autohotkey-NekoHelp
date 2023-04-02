import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import type { TBiFuncMsg } from '../../tools/Built-in/func.tools';
import { getBuiltInFuncMD } from '../../tools/Built-in/func.tools';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { getLStr } from '../../tools/str/removeSpecialChar';
import type { TLineFnCall } from '../Def/getFnRef';
import { fnRefLStr } from '../Def/getFnRef';
import { SignBiFn } from './SignatureFuncBuiltIn';

function SignatureFuncSnipText2Sign(selectionRangeText: string): string {
    const arr0: readonly string[] = selectionRangeText.split('\n');
    const arr1: string[] = [];
    for (const str of arr0) {
        if ((/[\t ];/u).test(str)) {
            arr1.push(str.slice(0, getLStr(str).length));
        } else {
            arr1.push(str);
        }
    }

    return arr1.join('\n').trim();
}

function SignUserFn(fnSymbol: CAhkFunc, comma: number): vscode.SignatureHelp | null {
    const {
        paramMap,
        selectionRangeText,
    } = fnSymbol;

    const parameters: vscode.ParameterInformation[] = [];
    for (const { keyRawName } of paramMap.values()) {
        parameters.push(new vscode.ParameterInformation(keyRawName));
    }

    const label: string = selectionRangeText.includes('\n')
        ? SignatureFuncSnipText2Sign(selectionRangeText)
        : selectionRangeText;
    const SignatureInformation = new vscode.SignatureInformation(label);
    SignatureInformation.parameters = parameters;

    const Signature = new vscode.SignatureHelp();
    Signature.signatures = [SignatureInformation];
    Signature.activeSignature = 0;
    Signature.activeParameter = comma;
    return Signature;
}

export function SignatureFunc(AhkFileData: TAhkFileData, position: vscode.Position): vscode.SignatureHelp | null {
    const { line, character } = position;
    const { DocStrMap, AST } = AhkFileData;
    const AhkTokenLine: TAhkTokenLine = DocStrMap[line];
    const fnRefType1: readonly TLineFnCall[] = [...fnRefLStr(AhkTokenLine)];
    if (fnRefType1.length === 0) {
        return null;
    }

    const leftFn: readonly TLineFnCall[] = fnRefType1.filter(({ col }: TLineFnCall): boolean => col < character);
    if (leftFn.length === 0) {
        return null;
    }

    const DA: CAhkFunc | null = getDAWithPos(AST, position);

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (DA !== null && DA.selectionRange.contains(position)) return null;

    const { lStr } = AhkTokenLine;
    const leftStr: string = lStr
        .slice(leftFn[0].col)
        .padStart(lStr.length);
    // const basePair =;
    for (const fnRefData of [...leftFn].reverse()) {
        const { upName, col } = fnRefData;
        let comma = 0;
        let brackets = 0;
        for (let i = col; i < character; i++) {
            const s: string = leftStr[i];
            // eslint-disable-next-line unicorn/prefer-switch
            if (s === '(') {
                brackets++;
            } else if (s === ')') {
                brackets--;
                if (brackets === 0) {
                    break; // not this func;
                }
            } else if (s === ',') {
                comma++;
            }
        }
        if (brackets !== 0) {
            const fnSymbol: CAhkFunc | null = getFuncWithName(upName);
            if (fnSymbol !== null) return SignUserFn(fnSymbol, comma);

            const buildInFn: TBiFuncMsg | undefined = getBuiltInFuncMD(upName);
            if (buildInFn !== undefined) return SignBiFn(buildInFn, comma);

            return null;
        }
    }

    return null;
}

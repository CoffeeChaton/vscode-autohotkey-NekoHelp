import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { getLStr } from '../../tools/str/removeSpecialChar';
import type { TLineFnCall } from '../Def/getFnRef';
import { fnRefLStr } from '../Def/getFnRef';

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

function SignatureFunc(AhkFileData: TAhkFileData, position: vscode.Position): vscode.SignatureHelp | null {
    const { line, character } = position;
    const { DocStrMap } = AhkFileData;
    const AhkTokenLine: TAhkTokenLine = DocStrMap[line];
    const fnRefType1: readonly TLineFnCall[] = [...fnRefLStr(AhkTokenLine)];
    if (fnRefType1.length === 0) return null;

    const leftFn: readonly TLineFnCall[] = fnRefType1.filter(({ col }: TLineFnCall): boolean => col < character);
    if (leftFn.length === 0) return null;

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
            if (fnSymbol !== null) {
                const { paramMap, selectionRangeText } = fnSymbol;
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
            // TODO else build in func
            return null;
        }
    }

    return null;
}

function SignatureHelpProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.SignatureHelp | null {
    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) return null;

    const funSign: vscode.SignatureHelp | null = SignatureFunc(AhkFileData, position);
    if (funSign !== null) return funSign;

    // TODO cmdSign, classSign

    return null;
}

// just of 1

export const SignatureHelpProvider: vscode.SignatureHelpProvider = {
    provideSignatureHelp(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        _context: vscode.SignatureHelpContext,
    ): vscode.ProviderResult<vscode.SignatureHelp> {
        return SignatureHelpProviderCore(document, position);
    },
};

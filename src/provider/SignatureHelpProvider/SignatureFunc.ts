import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine, TLineFnCall } from '../../globalEnum';
import type { TBiFuncMsg } from '../../tools/Built-in/2_built_in_function/func.tools';
import { getBuiltInFuncMD } from '../../tools/Built-in/2_built_in_function/func.tools';
import { CMemo } from '../../tools/CMemo';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { fnRefLStr } from '../Def/fnRefLStr';
import { SignBiFn } from './SignatureFuncBuiltIn';
import { SignUserFn } from './SignatureFuncUser';

const memoFnRefType1 = new CMemo<TAhkTokenLine, readonly TLineFnCall[]>(
    (AhkTokenLine: TAhkTokenLine): readonly TLineFnCall[] => fnRefLStr(AhkTokenLine),
);

export type TSignatureFuncMeta = {
    isBiFunc: false,
    ahkFunc: CAhkFunc,
    comma: number,
} | {
    isBiFunc: true,
    biFuncMsg: TBiFuncMsg,
    comma: number,
};

export function SignatureFuncCore(AhkFileData: TAhkFileData, position: vscode.Position): TSignatureFuncMeta | null {
    const { line, character } = position;
    const { DocStrMap, AST } = AhkFileData;
    const AhkTokenLine: TAhkTokenLine = DocStrMap[line];
    const fnRefType1: readonly TLineFnCall[] = memoFnRefType1.up(AhkTokenLine);
    if (fnRefType1.length === 0) return null;

    const leftFn: readonly TLineFnCall[] = fnRefType1.filter(({ col }: TLineFnCall): boolean => col < character);
    if (leftFn.length === 0) return null;

    const DA: CAhkFunc | null = getDAWithPos(AST, position);

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (DA !== null && DA.selectionRange.contains(position)) return null;

    const { lStr } = AhkTokenLine;
    const leftStr: string = lStr
        .slice(leftFn[0].col)
        .padStart(lStr.length);

    for (const fnRefData of [...leftFn].reverse()) {
        const { upName, col } = fnRefData;
        let comma = 0;
        let brackets = 0;
        let brackets2 = 0;
        let brackets3 = 0;

        for (let i = col; i < character; i++) {
            const s: string = leftStr[i];
            switch (s) {
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

            //
            if (brackets2 > 0 || brackets3 > 0) continue;

            if (s === '(') {
                brackets++;
            } else if (s === ')') {
                brackets--;
                if (brackets === 0) {
                    break; // not this func;
                }
            } else if (s === ',' && brackets === 1) {
                //
                comma++;
            }
        }

        if (brackets !== 0) {
            const ahkFunc: CAhkFunc | null = getFuncWithName(upName);
            if (ahkFunc !== null) {
                return {
                    isBiFunc: false,
                    ahkFunc,
                    comma,
                };
            }

            const biFuncMsg: TBiFuncMsg | undefined = getBuiltInFuncMD(upName);
            if (biFuncMsg !== undefined) {
                return {
                    isBiFunc: true,
                    biFuncMsg,
                    comma,
                };
            }

            return null;
        }
    }

    return null;
}

export function SignatureFunc(AhkFileData: TAhkFileData, position: vscode.Position): vscode.SignatureHelp | null {
    const need: TSignatureFuncMeta | null = SignatureFuncCore(AhkFileData, position);
    if (need === null) return null;

    return need.isBiFunc
        ? SignBiFn(need.biFuncMsg, need.comma)
        : SignUserFn(need.ahkFunc, need.comma);
}

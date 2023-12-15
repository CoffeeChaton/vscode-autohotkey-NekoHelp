import * as vscode from 'vscode';
import type { TArgs } from '../../tools/DeepAnalysis/FnVar/def/getFileFnUsing';

export function InlayHintDllCall(
    comma: number,
    args: readonly TArgs[],
): vscode.InlayHintLabelPart {
    /**
     * just need iArg
     *
     * ```ahk
     *  DllCall("DllFile\Function"               ; 0
     *                                  , Type1  ; 1
     *                                  , Arg1   ; 2
     *                                  , Type2  ; 3
     *                                  , Arg2   ; 4
     *                                      + 5
     *                                  , Type3  ; 5
     *                                  , Arg3   ; 6
     *         , "ReturnType" )                  ; last
     *
     * ```
     */
    // DllCall("Function"      , Type1,  Arg1,       Type2, Arg2, "Cdecl ReturnType")

    if (comma === 0) {
        return new vscode.InlayHintLabelPart('Function:');
    }
    const lastComma: number = args.at(-1)?.comma ?? -1;
    if (comma === lastComma) {
        return new vscode.InlayHintLabelPart('ReturnType:');
    }

    const Remainder: number = comma % 2;

    const i = Remainder === 0
        ? comma / 2
        : (comma - Remainder) / 2 + 1;
    const name = Remainder === 0
        ? `Arg${i}:`
        : `Type${i}:`;

    return new vscode.InlayHintLabelPart(name);
}

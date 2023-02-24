/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,-999] }] */
import type * as vscode from 'vscode';
import type { TConfigs } from '../../configUI.data';
import type { DeepReadonly, TAhkTokenLine } from '../../globalEnum';
import type { TBrackets } from '../../tools/Bracket';
import { lineReplace } from './fmtReplace';
import type { TFmtCore } from './FormatType';

type TWarnUse =
    & DeepReadonly<{
        lStrTrim: string,
        occ: number,
        options: vscode.FormattingOptions,
        switchDeep: number,
        topLabelDeep: 0 | 1,
        formatTextReplace: boolean,
        MultLine: -999 | 0 | 1,
        userConfigs: TConfigs['format'],
    }>
    & {
        brackets: TBrackets,
    };

function wrap(args: TWarnUse, text: string, AhkTokenLine: TAhkTokenLine): TFmtCore {
    const { lStrTrim, formatTextReplace } = args;
    const { line, textRaw } = AhkTokenLine;

    const newText: string = formatTextReplace
        ? lineReplace(AhkTokenLine, text, lStrTrim) // Alpha test options
        : text;

    return {
        line,
        oldText: textRaw,
        newText,
        hasOperatorFormat: newText !== text,
    };
}

function brackets2Deep(brackets: TBrackets, userConfigs: TConfigs['format']): number {
    let bracketsDeep: number = brackets[0];
    const { useSquareBracketsIndent, useParenthesesIndent } = userConfigs;
    if (useSquareBracketsIndent) bracketsDeep += brackets[1];
    if (useParenthesesIndent) bracketsDeep += brackets[2];
    if (bracketsDeep < 0) {
        /**
         * MsgBox % fn(a ;<------ "(" not match -> 0  ; this bug && need to fix after LStr fix
         * +b) ; <--------------- ")" ==== 0 -1 === -1
         */
        bracketsDeep = 0;
    }
    return bracketsDeep;
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export function fn_Warn_thisLineText_WARN(args: TWarnUse, AhkTokenLine: TAhkTokenLine): TFmtCore {
    const {
        lStrTrim,
        occ,
        brackets,
        options, // by self
        switchDeep,
        topLabelDeep,
        MultLine,
        userConfigs,
    } = args;
    const { textRaw, cll } = AhkTokenLine;

    /**
     * keep warning of this line!
     */
    if (MultLine === -999) {
        return wrap(args, textRaw, AhkTokenLine); // in multi-line and not open LTrim flag
    }

    const WarnLineBodyWarn: string = textRaw.trimStart();
    if (WarnLineBodyWarn === '') {
        return wrap(args, '', AhkTokenLine);
    }

    /**
     * 1. case1
     *     ```ahk
     *     fn(){
     *         return
     *     } ;<------- need -1
     *
     * 2. case2
     *    ```ahk
     *     if (bbb === ccc)
     *     { ; <------ need -1
     *
     *     }
     *     ```
     */
    const tempFixOfBracketsChange: -1 | 0 = lStrTrim.startsWith('}') || (occ > 0 && lStrTrim.startsWith('{'))
        ? -1
        : 0;

    /**
     * Semantically continues the previous line, but does not mean that this line is a non-blank line
     */
    const cllFix: 0 | 1 = lStrTrim === '' // AhkTokenLine.cll Include `;` && multilineFlag
        ? 0
        : cll; // 0 | 1

    /**
     * ```ahk
     * if (
     *  && )  ;<--------
     * ```
     * 1. (occ > 0)     ->
     * 2. fixCll === 1  -> line start with [+ && - new ] && line is  not `;`
     * 3. multilineFlag === null  -> not in multiline
     * 4. brackets[2] > 0   `(` not close
     */
    const cllFix2: -1 | 0 = cllFix === 1 && (userConfigs.useParenthesesIndent && brackets[2] > 0)
        ? -1
        : 0;

    const deepFix = Math.max(
        0,
        occ // fix this now...
            + cllFix2
            + tempFixOfBracketsChange
            + cllFix
            + switchDeep
            + MultLine // matrix
            + topLabelDeep // matrix
            + brackets2Deep(brackets, userConfigs), // matrix
    );

    const { insertSpaces, tabSize } = options;
    const TabSpaces: ' ' | '\t' = insertSpaces
        ? ' '
        : '\t';

    const TabSize: number = insertSpaces
        ? tabSize
        : 1;

    const DeepStr = TabSpaces.repeat(deepFix * TabSize);
    return wrap(args, `${DeepStr}${WarnLineBodyWarn}`, AhkTokenLine);
}

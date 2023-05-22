/* eslint-disable max-lines-per-function */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,-999] }] */
import type * as vscode from 'vscode';
import type { TConfigs } from '../../configUI.data';
import { ErmFirstCommaCommand } from '../../configUI.data';
import type { DeepReadonly, TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import type { TBrackets } from '../../tools/Bracket';
import { DirectivesMDMap } from '../../tools/Built-in/0_directive/Directives.tool';
import { CommandMDMap } from '../../tools/Built-in/6_command/Command.tools';
import { lineReplace } from './fmtReplace';
import type { TFmtCore } from './FormatType';
import { removeFirstCommaDirective } from './removeFirstCommaDirective';
import { rmFirstCommaCommand } from './rmFirstCommaCommand';
import { ToFmtCore } from './ToFmtCore';
import type { TFormatFlag } from './tools/getFormatFlag';

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
        betaList: TFormatFlag['betaList'],
        cmdTo1_or_2: ErmFirstCommaCommand,
    }>
    & {
        brackets: TBrackets,
        DocStrMap: TTokenStream,
    };

function fmtPlus(
    {
        args,
        indentBlank,
        textRawTrimStart,
        AhkTokenLine,
    }: { args: TWarnUse, indentBlank: string, textRawTrimStart: string, AhkTokenLine: TAhkTokenLine },
): TFmtCore {
    const {
        lStrTrim,
        formatTextReplace,
        betaList,
        userConfigs,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        cmdTo1_or_2,
    } = args;
    const { line, textRaw, detail } = AhkTokenLine;

    if (userConfigs.removeFirstCommaDirective && detail.includes(EDetail.isDirectivesLine)) {
        const ma: RegExpMatchArray | null = lStrTrim.match(/^#(\w+)[ \t]*,/u);
        if (ma !== null && DirectivesMDMap.has(ma[1].toUpperCase())) {
            return removeFirstCommaDirective(
                {
                    indentBlank,
                    textRawTrimStart,
                    ma1: ma[1],
                    AhkTokenLine,
                },
            );
        }
    }

    if (cmdTo1_or_2 === ErmFirstCommaCommand.to1 || cmdTo1_or_2 === ErmFirstCommaCommand.to2) {
        const { DocStrMap } = args;
        const {
            fistWordUp,
            fistWordUpCol,
            SecondWordUp,
            SecondWordUpCol,
        } = AhkTokenLine;
        if (CommandMDMap.has(fistWordUp)) {
            const textNewTrimStart: string = rmFirstCommaCommand({
                col: fistWordUp.length + fistWordUpCol,
                cmdTo1_or_2,
                AhkTokenLine,
                DocStrMap,
            });

            return ToFmtCore({ line, textRaw, newText: `${indentBlank}${textNewTrimStart}` });
        }

        if (CommandMDMap.has(SecondWordUp)) {
            const textNewTrimStart: string = rmFirstCommaCommand({
                col: SecondWordUp.length + SecondWordUpCol,
                cmdTo1_or_2,
                AhkTokenLine,
                DocStrMap,
            });

            return ToFmtCore({ line, textRaw, newText: `${indentBlank}${textNewTrimStart}` });
        }
    }

    const newText: string = formatTextReplace && betaList[line]
        ? lineReplace(AhkTokenLine, `${indentBlank}${textRawTrimStart}`, lStrTrim) // Alpha test options
        : `${indentBlank}${textRawTrimStart}`;

    return ToFmtCore({ line, textRaw, newText });
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
    const { textRaw, cll, line } = AhkTokenLine;

    /**
     * keep warning of this line!
     */
    if (MultLine === -999) {
        return ToFmtCore({ line, textRaw, newText: textRaw });
    }

    const textRawTrimStart: string = textRaw.trimStart();
    if (textRawTrimStart === '') {
        return ToFmtCore({ line, textRaw, newText: '' });
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

    const cllFix2WithMultiLine: 0 | 1 = lStrTrim === '' && MultLine === 1 && textRawTrimStart.startsWith(';')
        ? 1
        : 0;

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

    const deepFix: number = Math.max(
        0,
        0
            // fix this now...
            + occ
            + cllFix
            + cllFix2 // if (occ -> range like switch-range) then rm cll to format...
            + cllFix2WithMultiLine
            // OK
            + tempFixOfBracketsChange
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

    return fmtPlus({
        args,
        indentBlank: TabSpaces.repeat(deepFix * TabSize),
        textRawTrimStart,
        AhkTokenLine,
    });
}

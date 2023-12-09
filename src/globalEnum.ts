/* eslint-disable no-magic-numbers */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

// type NonNullable<T> = Exclude<T, null | undefined>; // Remove null and undefined from T

export type NonNull<T> = Exclude<T, null>;

/**
 * @param str input str
 * @param Sub search str
 * @param NSub replace str
 * @example ReplaceAll<'h-e-l-l-o world', '-', ''> === "hello world"
 */
export type ReplaceAll<Str extends string, Sub extends string, NSub extends string> = Str extends
    `${infer Before}${Sub}${infer Rest}` ? `${Before}${NSub}${ReplaceAll<Rest, Sub, NSub>}` : Str;

export const enum EDetail {
    inComment = 3,
    inCommentAhkDoc = 33,
    inSkipSign2 = 4, // old varName = v
    deepAdd = 5,
    deepSubtract = 6,
    hasDoubleSemicolon = 8,
    isHotStrLine = 9,
    isHotKeyLine = 10,
    isLabelLine = 11,
    isDirectivesLine = 12,
}

/**
 * https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section
 */
export const enum EMultiline {
    none = 0,
    start = 1,
    mid = 2,
    end = 3,
}

export type TPos = Readonly<{
    col: number,
    len: number,
}>;

/**
 * https://www.autohotkey.com/docs/v1/Scripts.htm#continuation-section
 */
export type TMultilineFlag =
    | DeepReadonly<{
        Join: TPos[], // https://www.autohotkey.com/docs/v1/Scripts.htm#Join
        LTrim: TPos[], // https://www.autohotkey.com/docs/v1/Scripts.htm#LTrim
        RTrim0: TPos[],
        CommentFlag: TPos[], // C
        PercentFlag: TPos[], // %
        commaFlag: TPos[], // ,
        accentFlag: TPos[], // `
        // ---
        unknownFlag: TPos[],
        L: number, // (
        R: number, // ;

        /**
         * false : end with ')'
         * true : end with ')' and '#' expression syntax (recommended):
         */
        isExpress: boolean,
    }>
    | null;

export const enum EFnRefBy {
    /**
     * by funcName(
     */
    justCall = 1,

    /**
     * by "funcName"
     */
    wordWrap = 2,

    /**
     * Sort f-flag
     */
    SortFlag = 7,

    /**
     * by -> (?CCallout)\
     * or -> (?CNumber)\
     * <https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#callout-functions>
     */
    Reg1 = 8,

    /**
     * by (?C:Function)\
     * <https://www.autohotkey.com/board/topic/36196-regex-callouts/page-2>
     */
    Reg2 = 9,

    /**
     * by (?CNumber:Function)\
     * <https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#auto>
     */
    Reg3 = 10,

    //
    SetTimer = 11,
    Hotkey = 12,
    Menu = 13,
    Gui = 14,
    //

    ComObjConnect = 991,
    /**
     * Do not use compare
     * need ts5.0
     * https://github.com/microsoft/TypeScript/issues/52701
     */
    // eslint-disable-next-line @typescript-eslint/no-mixed-enums
    banCompare = 'Do not use compare',
}

export type TLineFnCall = {
    upName: string,
    line: number,
    col: number,
    by: EFnRefBy,
};

export type TLineFnCallRaw = {
    fnName: string,
    col: number,
};

export type TAhkTokenLine = Readonly<{
    // TODO: replace as ([upName,col])[]
    /**
     * first ...
     */
    fistWordUpCol: number,
    fistWordUp: string,
    SecondWordUp: string,
    SecondWordUpCol: number,

    /**
     * In the case of a hypothesis as an expression, the formatted text keeps the front indentation
     */
    lStr: string,
    textRaw: string,
    deep2: number[],
    detail: readonly EDetail[],
    line: number,
    multiline: EMultiline,
    multilineFlag: TMultilineFlag,

    /**
     * continuation last line
     * but allow lStr === ''
     */
    cll: 0 | 1,
    lineComment: string,
    displayErr: boolean,
    displayFnErr: boolean,
    ahkDoc: string,
    // I know this is not Complete and correct Token.

    lineFnCallRaw: readonly TLineFnCallRaw[],
}>;

export type TTokenStream = readonly TAhkTokenLine[];

/**
 * vscode.uru.fsPath
 */
export type TFsPath = string;

export const enum EFormatChannel {
    byFormatAllFile = 'Format File',
    byFormatRange = 'Format Range',
    byFormatOnType = 'Format OnType',
    // byDev = 'wait for dev',
}

// https://github.com/modfy/nominal

// eslint-disable-next-line @typescript-eslint/naming-convention, init-declarations
declare const __nominal__type: unique symbol;
// type IPv4 = string & { [__nominal__type]: 'IPv4' };

// function isIPv4(input: any): input is IPv4 {
//     // nothing...
//     return true;
// }

// const ip = '192.168.0.0';
// if (isIPv4(ip)) {
//     console.log(ip);
//     //          ^?
// }

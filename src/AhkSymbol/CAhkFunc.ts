/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
import type { EFnMode } from '../tools/DeepAnalysis/FnVar/EFnMode';
import { ToUpCase } from '../tools/str/ToUpCase';
import type { CAhkSwitch } from './CAhkSwitch';
import type { TLineClass } from './TLineClass';

// ---------------------------------------------------------------------------
// WTF
// ---------------------------------------------------------------------------
type TUpName = string;

/**
 * if keyRawName = first def name -> 0
 * ; else -> string
 */
export type TC502New = string | 0;

export const enum EParamDefaultType {
    nothing = 0,

    string = 1,
    number = 2,
    boolean = 3,

    unknown = 10,
    notArray = 11,
    notObject = 12,
}
export type TParamMetaIn = {
    keyRawName: string,
    defRangeList: vscode.Range[],
    refRangeList: vscode.Range[],
    c502Array: TC502New[],
    parsedErrRange: vscode.Range | null,
    isByRef: boolean,
    isVariadic: boolean, // https://www.autohotkey.com/docs/v1/Functions.htm#Variadic
    defaultValue: string,
    defaultType: EParamDefaultType,
    commentList: string[],
};
export type TParamMetaOut = Readonly<TParamMetaIn>;

export type TParamMapIn = Map<TUpName, TParamMetaIn>; // k = valNameUP

export type TParamMapOut = ReadonlyMap<TUpName, TParamMetaOut>; // k = valNameUP

/**
 * https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/11
 */

export const enum EPseudoArray {
    byGuiControlGet_Cmd_Pos = 100,
    byGuiControlGet_Cmd_PosX = 111,
    byGuiControlGet_Cmd_PosY = 112,
    byGuiControlGet_Cmd_PosH = 113,
    byGuiControlGet_Cmd_PosW = 114,

    bySysGet_CMD = 200,
    bySysGet_CMD_Bottom = 201,
    bySysGet_CMD_Left = 202,
    bySysGet_CMD_Right = 203,
    bySysGet_CMD_Top = 204,

    /**
     * ```ahk
     * #Requires AutoHotkey v1.1.33+
     * ; https://www.autohotkey.com/docs/v1/lib/WinGet.htm#List
     * WinGet OutputVar, List ; To retrieve all windows on the entire system, omit all four title/text parameters.
     *
     * ListVars
     *
     * ; OutputVar[0 of 0]:
     * ; OutputVar1[0 of 0]:
     * ; OutputVar2[0 of 0]:
     * ; OutputVar3[0 of 0]:
     * ; ....
     *
     * MsgBox % "observe ListVars"
     * ```
     */
    byWinGet_CMD_listFa = 399,
    byWinGet_CMD_listCh = 302,

    // byStringSplit0 = 400,
    // byStringSplit1 = 401,
    /**
     * ```ahk
     * Colors := "red,green,blue"
     * StringSplit, ColorArray, Colors, `,
     *
     * ListVars
     * MsgBOx % ColorArray0 ; ColorArray0[1 of 3]: 3
     * MsgBOx % ColorArray1 ; ColorArray1[3 of 3]: red
     * MsgBOx % ColorArray2 ; ColorArray2[5 of 7]: green
     * MsgBOx % ColorArray3 ; ColorArray3[4 of 7]: blue
     * ```
     */
    byStringSplitFa = 499,
    byStringSplitCh = 402,
    // Infinitely filled masquerade array...I don't know what to do with it =_= thanks you ahk
}

export type TAssociated = {
    faRawName: string,
    chList: ({ chName: string, by: EPseudoArray })[],
    line: number,
    col: number,
    by: EPseudoArray,
};

export type TValMetaIn = {
    keyRawName: string,
    defRangeList: vscode.Range[],
    refRangeList: vscode.Range[],
    c502Array: TC502New[],
    commentList: string[], // c++ style comments
    jsDocStyle: string, //
    fnMode: EFnMode,
    AssociatedList: TAssociated[],
};
export type TValMetaOut = Readonly<TValMetaIn>;

export type TValMapIn = Map<TUpName, TValMetaIn>; // k = valNameUP

/**
 * k = valNameUP
 */
export type TValMapOut = ReadonlyMap<TUpName, TValMetaOut>;

export type TTextMetaIn = {
    keyRawName: string,
    // defRangeList: never[];
    refRangeList: vscode.Range[],
};
export type TTextMetaOut = Readonly<TTextMetaIn>;

export type TTextMapIn = Map<TUpName, TTextMetaIn>; // k = valNameUP

export type TTextMapOut = ReadonlyMap<TUpName, TTextMetaOut>; // k = valNameUP

export type TFnParamMeta = Readonly<{
    ATypeDef: string,
    BParamName: string,
    CInfo: string[],
}>;

export type TFnReturnMeta = {
    typeDef: string,
    info: string[],
};

export type TFnMeta = Readonly<{
    ahkDocMeta: {
        hasAhkDoc: boolean,
        paramMeta: TFnParamMeta[],
        returnMeta: TFnReturnMeta,
        otherMeta: string[],
    },

    returnList: string[],
}>;

type TCAhkFuncParam = {
    name: string,
    detail: string,

    range: vscode.Range,
    selectionRange: vscode.Range,
    //
    selectionRangeText: string,
    md: vscode.MarkdownString,
    uri: vscode.Uri,
    defStack: string[],
    paramMap: TParamMapOut,
    valMap: TValMapOut,
    textMap: TTextMapOut,
    ch: (CAhkSwitch | TLineClass)[],
    nameRange: vscode.Range,
    fnMode: EFnMode,

    meta: TFnMeta,
};

// AhkSymbol instanceof CAhkFunc

export class CAhkFunc extends vscode.DocumentSymbol {
    // readonly name...
    public readonly fnMode: EFnMode;

    public readonly nameRange: vscode.Range;

    public readonly selectionRangeText: string;

    public readonly md: vscode.MarkdownString;

    public readonly uri: vscode.Uri;

    public readonly upName: string;

    public readonly paramMap: TParamMapOut;

    public readonly valMap: TValMapOut;

    public readonly textMap: TTextMapOut;

    public readonly defStack: string[];

    public readonly meta: TFnMeta;

    //
    declare public readonly kind: vscode.SymbolKind.Function | vscode.SymbolKind.Method;

    declare public readonly children: (CAhkSwitch | TLineClass)[];

    public constructor(
        {
            name,
            detail,
            range,
            selectionRange,
            selectionRangeText,
            md,
            uri,
            defStack,
            paramMap,
            valMap,
            textMap,
            ch,
            nameRange,
            fnMode,
            meta,
        }: TCAhkFuncParam,
    ) {
        const kind = defStack.length === 0
            ? vscode.SymbolKind.Function
            : vscode.SymbolKind.Method;
        super(name, detail, kind, range, selectionRange);
        this.selectionRangeText = selectionRangeText;
        this.upName = ToUpCase(name);
        this.md = md;
        this.uri = uri;
        this.defStack = defStack;
        this.paramMap = paramMap;
        this.valMap = valMap;
        this.textMap = textMap;
        this.children = ch;

        this.nameRange = nameRange;
        this.fnMode = fnMode;
        this.meta = meta;
    }
}

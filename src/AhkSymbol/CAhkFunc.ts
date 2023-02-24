import * as vscode from 'vscode';
import type { DeepReadonly } from '../globalEnum';
import type { EFnMode } from '../tools/DeepAnalysis/FnVar/EFnMode';
import type { TLineClass } from './CAhkLine';
import type { CAhkSwitch } from './CAhkSwitch';

// ---------------------------------------------------------------------------
// WTF
// ---------------------------------------------------------------------------
type TUpName = string;
/**
 * if keyRawName = first def name -> 0
 * ; else -> string
 */
export type TC502New = string | 0;

export type TParamMetaIn = {
    keyRawName: string,
    defRangeList: vscode.Range[],
    refRangeList: vscode.Range[],
    c502Array: TC502New[],
    parsedErrRange: vscode.Range | null,
    isByRef: boolean,
    isVariadic: boolean, // https://www.autohotkey.com/docs/v1/Functions.htm#Variadic
    commentList: string[],
};
export type TParamMetaOut = DeepReadonly<TParamMetaIn>;

export type TParamMapIn = Map<TUpName, TParamMetaIn>; // k = valNameUP

export type TParamMapOut = ReadonlyMap<TUpName, TParamMetaOut>; // k = valNameUP

export type TValMetaIn = {
    keyRawName: string,
    defRangeList: vscode.Range[],
    refRangeList: vscode.Range[],
    c502Array: TC502New[],
    commentList: string[], // c++ style comments
    jsDocStyle: string, //
    fnMode: EFnMode,
};
export type TValMetaOut = DeepReadonly<TValMetaIn>;

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
export type TTextMetaOut = DeepReadonly<TTextMetaIn>;

export type TTextMapIn = Map<TUpName, TTextMetaIn>; // k = valNameUP

export type TTextMapOut = ReadonlyMap<TUpName, TTextMetaOut>; // k = valNameUP

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
        }: TCAhkFuncParam,
    ) {
        const kind = defStack.length === 0
            ? vscode.SymbolKind.Function
            : vscode.SymbolKind.Method;
        super(name, detail, kind, range, selectionRange);
        this.selectionRangeText = selectionRangeText;
        this.upName = name.toUpperCase();
        this.md = md;
        this.uri = uri;
        this.defStack = defStack;
        this.paramMap = paramMap;
        this.valMap = valMap;
        this.textMap = textMap;
        this.children = ch;

        this.nameRange = nameRange;
        this.fnMode = fnMode;
    }
}

import * as vscode from 'vscode';
import type { TParamMapIn, TParamMetaIn } from '../../AhkSymbol/CAhkFunc';
import { EParamDefaultType } from '../../AhkSymbol/CAhkFunc';
import type { TTokenStream } from '../../globalEnum';
import { replacerSpace } from '../str/removeSpecialChar';
import { ToUpCase } from '../str/ToUpCase';

type TParamData = {
    isByRef: boolean,
    isVariadic: boolean,
    keyRawName: string,
};

function getKeyRawName(param: string): TParamData {
    const isByRef: boolean = (/^ByRef\s+/iu).test(param);
    const key0: string = isByRef
        ? param.replace(/^ByRef\s+/iu, '')
        : param;
    const isVariadic: boolean = param.endsWith('*'); // https://www.autohotkey.com/docs/v1/Functions.htm#Variadic
    const keyRawName: string = isVariadic
        ? key0.replace(/\*$/u, '')
        : key0;
    return {
        isByRef,
        isVariadic,
        keyRawName,
    };
}

function getDefaultValue(textRawFix: string): {
    defaultType: EParamDefaultType,
    defaultValue: string,
} {
    if (!(/^:?=/u).test(textRawFix)) {
        return {
            defaultType: EParamDefaultType.nothing,
            defaultValue: '',
        };
    }

    const sLen: string = textRawFix.replace(/^:?=[ \t]*/u, '');
    const maTF: RegExpMatchArray | null = sLen.match(/^(true|false)/iu);
    if (maTF !== null) {
        return {
            defaultType: EParamDefaultType.boolean,
            defaultValue: maTF[1],
        };
    }

    if (sLen.startsWith('"')) {
        //
        const { length } = sLen;
        let i = 1;
        for (i = 1; i < length; i++) {
            const s: string = sLen[i];
            if (s === '"') {
                const s2: string | undefined = sLen.at(i + 1);
                if (s2 === '"') {
                    i++;
                } else {
                    break;
                }
            }
        }
        return {
            defaultType: EParamDefaultType.string,
            defaultValue: sLen.slice(0, i + 1),
        };
    }

    const ma0: RegExpMatchArray | null = sLen.match(/^([-+]?[.x\da-f^]+)/iu);
    if (ma0 !== null) {
        return {
            defaultType: EParamDefaultType.number,
            defaultValue: ma0[1],
        };
    }

    // TODO diag default param is array or object or variable
    // https://www.autohotkey.com/docs/v1/Functions.htm#optional

    if (sLen.startsWith('[')) {
        return {
            defaultType: EParamDefaultType.notArray,
            defaultValue: sLen.slice(0, sLen.search(/\]|$/u)),
        };
    }

    if (sLen.startsWith('{')) {
        return {
            defaultType: EParamDefaultType.notObject,
            defaultValue: sLen.slice(0, sLen.search(/\}|$/u)),
        };
    }

    return {
        defaultType: EParamDefaultType.unknown,
        defaultValue: sLen.slice(0, sLen.search(/\s|$/u)),
    };
}

export function getParamDef(_fnName: string, selectionRange: vscode.Range, DocStrMap: TTokenStream): TParamMapIn {
    // 113 ms self time
    const paramMap: TParamMapIn = new Map<string, TParamMetaIn>();
    const startLine: number = selectionRange.start.line;
    const endLine: number = selectionRange.end.line;
    for (
        const {
            lStr,
            line,
            lineComment,
            textRaw,
        } of DocStrMap
    ) {
        if (line < startLine) continue;
        if (line > endLine) break;
        let lStrFix: string = lStr;

        if (startLine === line) lStrFix = lStrFix.replace(/^[ \t}]*[#$@\w\u{A1}-\u{FFFF}]+\(/u, replacerSpace);
        if (endLine === line) {
            lStrFix = lStrFix
                .replace(/\{\s*$/u, replacerSpace)
                .replace(/\)\s*$/u, replacerSpace);
        }

        if (lStrFix.trim() === '') break;

        const strF: string = lStrFix
            .replaceAll(/:?=\s*\^+/gu, replacerSpace)
            .replaceAll(/:?=\s*(?:true|false)/giu, replacerSpace)
            .replaceAll(/:?=\s*[-+]?[.x\da-f^]+/giu, replacerSpace);
        // := "" string
        // := 0x00ffffff
        // -0.5 , 0.8
        //  1.0e^3
        // True, false

        const strF2: string = strF.replaceAll(/\bByRef\b/giu, replacerSpace);

        for (const ma of strF.matchAll(/\s*([^,]+),?/gu)) {
            const param: string = ma[1].trim();
            if (param === '') continue;

            const find: string = param.replace(/\bByRef\b\s*/iu, '');
            const ch: number = strF2.indexOf(find, ma.index);

            const { isByRef, isVariadic, keyRawName } = getKeyRawName(param);

            const range: vscode.Range = new vscode.Range(
                new vscode.Position(line, ch),
                new vscode.Position(line, ch + keyRawName.length),
            );

            const parsedErrRange: vscode.Range | null = (/^[#$@\w\u{A1}-\u{FFFF}]+$/u).test(keyRawName)
                ? null
                : range;

            const textRawFix: string = textRaw.slice(ch + keyRawName.length).trimStart();
            const { defaultType, defaultValue } = getDefaultValue(textRawFix);

            const ArgAnalysis: TParamMetaIn = {
                keyRawName,
                defRangeList: [{ range, c502: 0 }],
                refRangeList: [],
                parsedErrRange,
                isByRef,
                isVariadic,
                defaultValue,
                defaultType,
                commentList: [
                    lineComment.startsWith(';')
                        ? lineComment.slice(1)
                        : '',
                ],
            };

            const key: string = ToUpCase(ArgAnalysis.keyRawName);
            paramMap.set(key, ArgAnalysis);
        }
    }

    return paramMap;
}

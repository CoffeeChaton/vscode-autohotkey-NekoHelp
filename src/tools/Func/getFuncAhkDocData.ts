/* eslint-disable @fluffyfox/no-single-return */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { CMemo } from '../CMemo';
import { ToUpCase } from '../str/ToUpCase';

type TParamSignMap = ReadonlyMap<string, vscode.MarkdownString>;

const wmParamSignMap = new CMemo<CAhkFunc, TParamSignMap>((ahkFunc: CAhkFunc): TParamSignMap => {
    const { md, uri } = ahkFunc;
    type TLineData = { i: number, str: string };
    const mdList: readonly TLineData[] = md.value.split('\n')
        .map((str: string, i: number): TLineData => ({ i, str }));

    const paramDocList: readonly { i: number, str: string }[] = mdList
        .filter(({ str }: TLineData): boolean => (/^\s*@param\b/iu).test(str));

    const paramJsDocMap = new Map<string, vscode.MarkdownString>();

    for (const { i, str } of paramDocList) {
        // @param {string} param_name msg
        // a1     {string} param_name msg
        //        a2       param_name msg
        //                 ^ a3       msg
        //                 ma1 -> param_name
        //        m2 -> type-str

        const a1: string = str.replace(/^\s*@param\s*/iu, '');
        const a2: string = a1.replace(/^\{[^}]+\}\s*/u, '');

        const paramNameMatch: RegExpMatchArray | null = a2.match(/\s*([#$@\w\u{A1}-\u{FFFF}]+)/iu);

        if (paramNameMatch !== null) {
            const ma1: string = paramNameMatch[1];
            const useTypeMatch: RegExpMatchArray | null = a1.match(/^\{([^}]+)\}/u);

            const pmd: vscode.MarkdownString = new vscode.MarkdownString('*@param* ', true);
            if (useTypeMatch !== null) {
                pmd.appendMarkdown(`{\`${useTypeMatch[1]}\`} `);
            }
            pmd.appendMarkdown(`[**${ma1}**](file:${uri.fsPath}) ${a2.replace(ma1, '')}`);

            for (let i2 = i + 1; i2 < mdList.length; i2++) {
                const e: TLineData | undefined = mdList.at(i2);
                if (e === undefined || e.str.trimStart().startsWith('@')) {
                    break;
                }
                pmd.appendMarkdown(`\n${e.str}`);
            }
            paramJsDocMap.set(ToUpCase(ma1), pmd);
        }
    }

    return paramJsDocMap;
});

const wmReturnSign = new CMemo<CAhkFunc, string>((ahkFunc: CAhkFunc): string => {
    const { md } = ahkFunc;
    const lineData: readonly string[] = md.value.split('\n').map((str: string): string => str.trimStart());
    const lineStr: string | undefined = lineData.find((str: string): boolean => (/^@return\b/iu).test(str));

    if (lineStr !== undefined) {
        //
        // @return {string} msg   -> return string
        // @return var_name       -> return var_name
        const ss: string = lineStr.replace(/^@return\s*/iu, '');
        if (ss.startsWith('{')) {
            const col: number = ss.indexOf('}');
            return ss.slice(1, col);
        }
        return ss.slice(0, ss.search(/\s/u));
    }

    let s3 = '';

    for (const s of lineData) {
        if ((/^return\b/iu).test(s)) {
            const s4: string = s
                .replace(/^return\s*/iu, '')
                .replace(/[ \t]*;.*/u, '')
                .trim();

            if (s4 !== '') s3 = s4;
        }
        if (s === '***') break;
    }

    return s3;
});

type TFAhkDopData = {
    paramSignMap: TParamSignMap,
    returnSign: string,
};

export function getFuncAhkDocData(ahkFunc: CAhkFunc): TFAhkDopData {
    return {
        paramSignMap: wmParamSignMap.up(ahkFunc),
        returnSign: wmReturnSign.up(ahkFunc),
    };
}

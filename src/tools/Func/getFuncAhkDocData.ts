/* eslint-disable @fluffyfox/no-single-return */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { CMemo } from '../CMemo';
import { ToUpCase } from '../str/ToUpCase';

type TParamSignMap = ReadonlyMap<string, vscode.MarkdownString>;

const wmParamSignMap = new CMemo<CAhkFunc, TParamSignMap>((ahkFunc: CAhkFunc): TParamSignMap => {
    const { uri } = ahkFunc;
    const { paramMeta } = ahkFunc.getMeta().ahkDocMeta;

    const paramJsDocMap = new Map<string, vscode.MarkdownString>();

    for (const { ATypeDef, BParamName, CInfo } of paramMeta) {
        // {ATypeDef: 'string', BParamName: 'LT_bgColor_N', CInfo: "1_r_N",''}
        // @param {string} param_name info
        // *@param* {`string`} [**LT_bgColor_N**](file:c:\DEV\dev_main_P7\c.ahk) "1_r_N"

        const pmd: vscode.MarkdownString = new vscode.MarkdownString('*@param* ', true);
        if (ATypeDef !== '') {
            pmd.appendMarkdown(`{\`${ATypeDef}\`} `);
        }
        pmd.appendMarkdown(`[**${BParamName}**](file:${uri.fsPath}) ${CInfo.join('\n')}`);

        paramJsDocMap.set(ToUpCase(BParamName), pmd);
    }

    return paramJsDocMap;
});

const wmReturnSign = new CMemo<CAhkFunc, string>((ahkFunc: CAhkFunc): string => {
    const { returnList, ahkDocMeta } = ahkFunc.getMeta();

    // @return {string} info   -> return string
    // @return info       -> return info
    const { typeDef, info } = ahkDocMeta.returnMeta;
    if (typeDef !== '') return typeDef;

    const info0: string | undefined = info.at(0);
    if (info0 !== undefined) {
        return info0
            .slice(0, info0.search(/\s|$/u))
            .trim();
    }

    let s3 = '';

    for (const s of returnList) {
        const s4: string = s
            .replace(/^\s*return\s*/iu, '')
            .replace(/[ \t]*;.*/u, '')
            .trim();

        if (s4 !== '') s3 = s4;
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

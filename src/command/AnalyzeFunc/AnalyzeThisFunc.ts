import * as vscode from 'vscode';
import type {
    CAhkFunc,
    TParamMapOut,
    TTextMapOut,
    TValMapOut,
} from '../../AhkSymbol/CAhkFunc';
import type { TTokenStream } from '../../globalEnum';
import type { TFullFuncMap } from '../../tools/Func/getAllFunc';
import { getAllFunc } from '../../tools/Func/getAllFunc';
import { fmtOutPutReport } from '../tools/fmtOutPutReport';
import { AnalyzeCommand } from './AnalyzeCommand';
import { AnalyzeGlobalVal } from './AnalyzeGlobalVal';
import { AnalyzeRefFunc } from './AnalyzeRefFunc';

function showElement(map: TParamMapOut | TTextMapOut | TValMapOut): string {
    return [...map.values()]
        .map((e): string => e.keyRawName)
        .join(', ');
}

export async function AnalyzeFuncMain(DA: CAhkFunc, AhkTokenList: TTokenStream): Promise<void> {
    const fullFuncMap: TFullFuncMap = getAllFunc();

    const t1: number = Date.now();
    const ed: string[] = [
        `Analyze_Results_of_${DA.name}() {`,
        'throw, "this is Analyze Results, not .ahk"',
        `${DA.name}() ;`,
        '/**',
        `* @Analyze ${DA.name}`,
        '* ',
        '* @Base Data',
        '* ',
        `* @param : ${DA.paramMap.size} of [${showElement(DA.paramMap)}]`,
        `* @value : ${DA.valMap.size} of [${showElement(DA.valMap)}]`,
        `* @unknownText : ${DA.textMap.size} of [${showElement(DA.textMap)}]`,
        '*/',
        '',
        ...AnalyzeCommand(AhkTokenList, fullFuncMap),
        ...AnalyzeRefFunc(AhkTokenList, fullFuncMap),
        ...AnalyzeGlobalVal(AhkTokenList),
        '}',
        '; Analyze End',
        `; use ${Date.now() - t1} ms`,
    ];

    const document: vscode.TextDocument = await vscode.workspace.openTextDocument({
        language: 'ahk',
        content: ed.join('\n'),
    });

    await fmtOutPutReport(document);

    await vscode.window.showTextDocument(document);
}

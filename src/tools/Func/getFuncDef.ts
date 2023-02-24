import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';

export type TFuncDefData = {
    name: string,
    selectionRange: vscode.Range,
};

function getFuncDefData(DocStrMap: TTokenStream, defLine: number, searchLine: number, name: string): TFuncDefData {
    const colS: number = DocStrMap[defLine].lStr.search(/\w/u);
    const colE: number = DocStrMap[searchLine].lStr.lastIndexOf(')') + 1;
    //  const colFixE = colE === -1 ? DocStrMap[searchLine].lStr.length : colE;
    const selectionRange: vscode.Range = new vscode.Range(
        new vscode.Position(defLine, colS),
        new vscode.Position(searchLine, colE),
    );
    return { name, selectionRange };
}

type TFuncTailType = {
    DocStrMap: TTokenStream,
    searchTextTrim: string,
    name: string,
    searchLine: number,
    defLine: number,
};

function getFuncTail({
    DocStrMap,
    searchTextTrim,
    name,
    searchLine,
    defLine,
}: TFuncTailType): TFuncDefData | null {
    // i+1   ^, something , something ........ ) {$
    if ((/\)\s*\{$/u).test(searchTextTrim)) {
        return getFuncDefData(DocStrMap, defLine, searchLine, name);
    }
    if (searchLine + 1 === DocStrMap.length) return null;

    // i+1   ^, something , something ......)$
    // i+2   ^{
    if (
        searchTextTrim.endsWith(')')
        && DocStrMap[searchLine + 1].lStr.trim().startsWith('{')
    ) {
        return getFuncDefData(DocStrMap, defLine, searchLine, name);
    }

    return null;
}

export function getFuncDef(DocStrMap: TTokenStream, defLine: number): TFuncDefData | null {
    if (defLine + 1 === DocStrMap.length) return null;
    const textFixTrim: string = DocStrMap[defLine].lStr.replace(/^[ \t}]*/u, '').trim();

    const fnHead: RegExpMatchArray | null = textFixTrim.match(/^(\w+)\(/u); //  funcName(...
    if (fnHead === null) return null;

    const name: string = fnHead[1];
    if ((/^(?:if|while)$/iu).test(name)) return null;

    const funcData: TFuncDefData | null = getFuncTail({
        DocStrMap,
        searchTextTrim: textFixTrim,
        name,
        searchLine: defLine,
        defLine,
    });
    if (funcData !== null) return funcData;

    if (DocStrMap[defLine].lStr.includes(')')) return null; // fn_Name( ... ) ...  ,this is not ahk function

    // I don't think the definition of the function will exceed 15 lines.
    // eslint-disable-next-line no-magic-numbers
    const iMax: number = Math.min(defLine + 15, DocStrMap.length);
    for (let searchLine = defLine + 1; searchLine < iMax; searchLine++) {
        const searchTextTrim: string = DocStrMap[searchLine].lStr.trim();

        if (!searchTextTrim.startsWith(',')) return null;

        const funcData2: TFuncDefData | null = getFuncTail({
            DocStrMap,
            searchTextTrim,
            name,
            searchLine,
            defLine,
        });
        if (funcData2 !== null) return funcData2;
    }
    return null;
}

// TODO bool IsFunction(LPTSTR aBuf, bool *aPendingFunctionHasBrace = NULL)

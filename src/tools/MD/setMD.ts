import * as vscode from 'vscode';
import type { TVarData } from '../../AhkSymbol/CAhkFunc';
import type { ESnippetRecBecause } from '../../provider/CompletionItem/DA/ESnippetRecBecause';

export const enum EPrefix {
    var = 'var',
    Param = 'Param',
    ByRefVariadicParam = 'ByRef Variadic Param',
    ByRefParam = 'ByRef Param',
    unKnownText = 'unKnownText',
}

function RangeList2Str(RangeList: readonly TVarData[]): string {
    return RangeList
        .map(({ range }: TVarData): string => `  - line ${range.start.line + 1}, col ${range.start.character + 1}</br>`)
        .join('\n');
}

type TSetMD = {
    prefix: EPrefix,
    refRangeList: readonly TVarData[],
    defRangeList: readonly TVarData[],
    funcName: string,
    recStr: ESnippetRecBecause | '',
    commentList: readonly string[],
    jsDocStyle: string,
};

function commentList2Str(commentList: readonly string[]): string {
    const commentList2 = commentList.filter((v: string): boolean => v !== '');
    return commentList2.length > 0
        ? `---\n\n${commentList2.join('\n\n')}\n\n---\n\n`
        : '';
}

export function setMD(
    {
        prefix,
        refRangeList,
        defRangeList,
        funcName,
        recStr,
        commentList,
        jsDocStyle,
    }: TSetMD,
): vscode.MarkdownString {
    const doc: string = jsDocStyle === ''
        ? commentList2Str(commentList)
        : `---\n\n${jsDocStyle}\n\n---\n\n`;
    const st = [
        '```ahk',
        `${prefix} of ${funcName}()`,
        '```',
        recStr,
        doc,
        '- def',
        RangeList2Str(defRangeList),
        '',
        '- ref',
        RangeList2Str(refRangeList),
        '',
    ].join('\n');
    const md: vscode.MarkdownString = new vscode.MarkdownString(st, true);
    md.supportHtml = true;

    // .appendCodeblock(`${prefix} of ${funcName}()`)
    // .appendMarkdown(recStr)
    // .appendMarkdown(doc)
    // .appendMarkdown('- <details><summary>def</summary>\n')
    // .appendMarkdown(RangeList2Str(defRangeList))
    // .appendMarkdown('\n</details>')
    // .appendMarkdown('\n')
    // .appendMarkdown('- <details><summary>ref</summary>\n')
    // .appendMarkdown(RangeList2Str(refRangeList))
    // .appendMarkdown('\n</details>');
    return md;
}

// icon https://code.visualstudio.com/api/references/icons-in-labels

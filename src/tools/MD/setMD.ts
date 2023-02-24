import * as vscode from 'vscode';
import type { ESnippetRecBecause } from '../../provider/CompletionItem/DA/ESnippetRecBecause';

export const enum EPrefix {
    var = 'var',
    Param = 'Param',
    ByRefVariadicParam = 'ByRef Variadic Param',
    ByRefParam = 'ByRef Param',
    VariadicParam = 'Variadic Param',
    unKnownText = 'unKnownText',
}

function RangeList2Str(RangeList: readonly vscode.Range[]): string {
    return RangeList
        .map((range: vscode.Range): string => `  - line ${range.start.line + 1}, col ${range.start.character + 1}</br>`)
        .join('\n');
}

type TSetMD = {
    prefix: EPrefix,
    refRangeList: readonly vscode.Range[],
    defRangeList: readonly vscode.Range[],
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
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendCodeblock(`${prefix} of ${funcName}()`)
        .appendMarkdown(recStr)
        .appendMarkdown(doc)
        .appendMarkdown('- <details><summary>def</summary>\n')
        .appendMarkdown(RangeList2Str(defRangeList))
        .appendMarkdown('\n</details>')
        .appendMarkdown('\n')
        .appendMarkdown('- <details><summary>ref</summary>\n')
        .appendMarkdown(RangeList2Str(refRangeList))
        .appendMarkdown('\n</details>');
    md.supportHtml = true;
    return md;
}

// icon https://code.visualstudio.com/api/references/icons-in-labels

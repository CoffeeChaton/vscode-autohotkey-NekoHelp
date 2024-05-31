import * as vscode from 'vscode';
import type { TApiMeta } from '../../../../script/make_vba_json';
import { getVbaData } from '../../CompletionItem/vba/getVbaData';
import { vbaApiFileMap } from '../../CompletionItem/vba/vbaApiFileMap';

export function hoverComObjActive(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Hover | null {
    const leftText: string = document.getText(
        new vscode.Range(
            new vscode.Position(position.line, 0),
            position,
        ),
    );

    if (!(/\bComObjActive\(\s*"?[\w.]+/iu).test(leftText.trim())) {
        return null;
    }

    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /\b[\w.]+/u);
    if (range === undefined) return null;

    const wordUp: string = document.getText(range)
        .replace(/\..*/u, '')
        .toUpperCase();

    const filePath: string | undefined = vbaApiFileMap.get(wordUp);
    if (filePath === undefined) return null;

    const { api_nameMap } = getVbaData(filePath);
    const ApiMetaList: TApiMeta[] | undefined = api_nameMap.get(document.getText(range).toUpperCase());
    if (ApiMetaList === undefined) return null;

    //

    const md = new vscode.MarkdownString('');
    md.appendCodeblock(
        `// ${filePath}`,
        'js',
    );
    for (const ApiMeta of ApiMetaList) {
        md.appendMarkdown('\n---\n');
        md.appendCodeblock(
            JSON.stringify(ApiMeta, null, 4),
            'json',
        );
    }

    return new vscode.Hover(md, range);
}

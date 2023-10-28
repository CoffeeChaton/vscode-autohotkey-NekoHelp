import * as vscode from 'vscode';
import type { CAhkClass } from '../../AhkSymbol/CAhkClass';
import type { TAhkFileData } from '../../core/ProjectManager';
import { ToUpCase } from '../../tools/str/ToUpCase';
import { getFileAllClass } from '../../tools/visitor/getFileAllClassList';
import type { TWmThisPos } from '../CompletionItem/classThis/getWmThis';
import { WmThisCore } from '../CompletionItem/classThis/getWmThis';

export function ClassProperty2Range(
    property: readonly TWmThisPos[],
    uri: vscode.Uri,
    listAllUsing: boolean,
): vscode.Location[] {
    if (listAllUsing) {
        return property
            .map((v: TWmThisPos): vscode.Location => (new vscode.Location(
                uri,
                new vscode.Range(
                    new vscode.Position(v.line, v.col),
                    new vscode.Position(v.line, v.col + v.rawName.length),
                ),
            )));
    }

    const { line, col, rawName } = property[0];
    return [
        new vscode.Location(
            uri,
            new vscode.Range(
                new vscode.Position(line, col),
                new vscode.Position(line, col + rawName.length),
            ),
        ),
    ];
}

export function ClassProperty2Md(property: readonly TWmThisPos[]): vscode.Hover {
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendCodeblock(`this.${property[0].rawName}`)
        .appendMarkdown('- <details><summary>ref</summary>\n');
    md.supportHtml = true;

    for (const v of property) {
        const { line, col } = v;
        md.appendMarkdown(`  - Ln ${line + 1}, Col ${col + 1}</br>\n`);
    }
    md.appendMarkdown('\n</details>');

    return new vscode.Hover(md);
}

export function getClassProperty(
    document: vscode.TextDocument,
    position: vscode.Position,
    AhkFileData: TAhkFileData,
): readonly TWmThisPos[] | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(
        position,
        /(?<=this\.)[#$@\w\u{A1}-\u{FFFF}]+(?=[#$@.`%!"/&')*+,\-:;<=>?[\\^\]{|}~ \t]|$)/iu,
        // // without .` and #$@
    );
    if (range === undefined) return null;
    const wordUp: string = ToUpCase(document.getText(range));

    const classList: readonly CAhkClass[] = getFileAllClass(AhkFileData.AST);
    const ahkClass: CAhkClass | undefined = classList.find((c: CAhkClass): boolean => c.range.contains(position));

    if (ahkClass === undefined) return null;
    return WmThisCore.up(ahkClass).get(wordUp) ?? null;
}

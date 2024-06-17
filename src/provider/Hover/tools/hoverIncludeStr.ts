import * as fs from 'node:fs';
import * as vscode from 'vscode';
import type { CAhkInclude } from '../../../AhkSymbol/CAhkInclude';
import { EInclude } from '../../../AhkSymbol/CAhkInclude';
import { collectInclude } from '../../../command/tools/collectInclude';
import type { TAhkFileData } from '../../../core/ProjectManager';
import { EDetail } from '../../../globalEnum';
import { $t } from '../../../i18n';
import { toNormalize } from '../../../tools/fsTools/toNormalize';
import { getAhkFileOutline } from '../../../tools/MD/getAhkFileOutline';
import { gotoIncludeDefWithTry } from '../../Def/gotoIncludeDef';

export function hoverIncludeStr(
    AhkFileData: TAhkFileData,
    position: vscode.Position,
): vscode.Hover | null {
    const { DocStrMap, AST } = AhkFileData;
    const { line } = position;
    const { detail, lStr } = DocStrMap[line];

    if (!(detail.includes(EDetail.isDirectivesLine) && (/^\s*#Include(?:Again)?\s/iu).test(lStr))) return null;

    const ahkInclude: CAhkInclude | undefined = collectInclude(AST).find((v) => v.range.contains(position));
    if (ahkInclude === undefined) return null;

    const { mayPath, warnMsg, type } = ahkInclude.rawData;
    const col0: number = lStr.length - lStr
        .replace(/^\s*#Include(?:Again)?\s+/iu, '')
        .replace(/\*i\s+/iu, '')
        .length;
    const range: vscode.Range = new vscode.Range(
        new vscode.Position(line, col0),
        new vscode.Position(line, lStr.length),
    );

    const md: vscode.MarkdownString = new vscode.MarkdownString('', true);

    const md0: string = getAhkFileOutline(toNormalize(mayPath)).value;
    if (md0.endsWith('unopened files')) {
        if (
            type !== EInclude.isUnknown
            && type !== EInclude.A_ScriptDir
            && type !== EInclude.A_WorkingDir
            && fs.existsSync(mayPath)
        ) {
            md.appendCodeblock(`#Include ${mayPath.replaceAll('/', '\\')} ;unopened files`, 'ahk');
        } else {
            const text = `${$t('hover.Include.unknown-1')} at "${mayPath.replaceAll('/', '\\')}"`;
            md
                .appendMarkdown(text)
                .appendMarkdown(`\n${$t('hover.Include.did_you_mean')}`);
            const LocationList: vscode.LocationLink[] = gotoIncludeDefWithTry(mayPath, lStr, line);
            for (const v of LocationList) {
                const p1: string = v.targetUri.fsPath.replace('//', '/');
                md.appendCodeblock(`    -> "${p1}"`);
            }
        }
    } else {
        md.appendMarkdown(md0);
    }

    if (warnMsg !== '') {
        md.appendMarkdown(warnMsg);
    }

    return new vscode.Hover(md, range);
}

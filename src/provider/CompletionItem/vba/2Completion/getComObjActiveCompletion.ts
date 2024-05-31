import * as vscode from 'vscode';
import type { TAhkFileData } from '../../../../core/ProjectManager';
import { getVbaData } from '../getVbaData';
import { vbaApiFileMap } from '../vbaApiFileMap';
import { CVbaCompletionItem } from './CVbaCompletionItem';

//
const vbaPrefix: CVbaCompletionItem[] = ((): CVbaCompletionItem[] => {
    const vbaList = [
        'Access',
        'Excel',
        'Office',
        'Outlook',
        'PowerPoint',
        'Project',
        'Publisher',
        //   'unknown',
        'Visio',
        'Word',
    ];
    const md = new vscode.MarkdownString('');
    md.appendCodeblock(
        vbaList
            .map((s) => `"${s}"`)
            .join('\n'),
        'js',
    );

    const need: CVbaCompletionItem[] = [];
    for (const s of vbaList) {
        const item = new CVbaCompletionItem(
            s,
            vscode.CompletionItemKind.Text,
            md,
        );
        item.insertText = `"${s}"`;
        need.push(item);
    }

    return need;
})();

function vbaComObjActiveFirstParamSet(
    position: vscode.Position,
    document: vscode.TextDocument,
): CVbaCompletionItem[] {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /\b[\w.]+/u);
    if (range === undefined) return [];

    const wordUp: string = document.getText(range)
        .replace(/\..*/u, '')
        .toUpperCase();

    const filePath: string | undefined = vbaApiFileMap.get(wordUp);
    if (filePath === undefined) return [];
    // vbaApiFileMap.keys
    // [
    //     'Access',
    //     'Excel',
    //     'Office',
    //     'Outlook',
    //     'PowerPoint',
    //     'Project',
    //     'Publisher',
    //     //   'unknown',
    //     'Visio',
    //     'Word',
    // ]

    const { api_nameMap } = getVbaData(filePath);

    const need: CVbaCompletionItem[] = [];

    for (const iterator of api_nameMap.values()) {
        for (const ApiMeta of iterator) {
            if (ApiMeta.kind !== 'object') continue;

            const md = new vscode.MarkdownString('');
            md.appendCodeblock(
                `// ${filePath}`,
                'js',
            );
            md.appendCodeblock(
                JSON.stringify(ApiMeta, null, 4),
                'json',
            );

            const item = new CVbaCompletionItem(
                ApiMeta.api_name,
                vscode.CompletionItemKind.Text,
                md,
            );
            item.insertText = ApiMeta.api_name.replace(/^\w+\./u, '');
            // ...
            need.push(item);
        }
    }

    return need;
}

//
export function getComObjActiveCompletion(
    _AhkFileData: TAhkFileData,
    position: vscode.Position,
    document: vscode.TextDocument,
    context: vscode.CompletionContext,
): CVbaCompletionItem[] {
    const leftText: string = document.getText(
        new vscode.Range(
            new vscode.Position(position.line, 0),
            position,
        ),
    );

    if (
        context.triggerCharacter === '.'
        && (/\bComObjActive\(\s*"?[\w.]+/iu).test(leftText.trim())
    ) {
        return vbaComObjActiveFirstParamSet(position, document);
    }

    if ((/\bComObjActive\(\s*"?/iu).test(leftText.trim())) {
        return vbaPrefix;
    }

    return [];
}

import * as fs from 'node:fs';
import path from 'node:path';
import * as vscode from 'vscode';

export type TLanguage = 'en' | 'zh-tw' | 'zh-cn';
export const localeLanguage: TLanguage = ((): TLanguage => {
    const { language } = vscode.env;

    if (language === 'en') return 'en';
    if (language === 'en-US') return 'en';
    if (language === 'zh-cn') return 'zh-cn';
    if (language === 'zh-tw') return 'zh-tw';

    return 'en';
})();

export type TSupportDoc =
    | 'A_Variables'
    | 'func';

const rootDir: string = path.resolve(__dirname, '../ahk.json');

export function getNlsPath(filename: TSupportDoc): string {
    return path
        .join(rootDir, `${filename}.${localeLanguage}.ahk.json`)
        .replace('\\', '/');
}

export function readNlsJson(filename: TSupportDoc): unknown {
    const targetPath: string = getNlsPath(filename);
    const dataFromJson: string = fs.readFileSync(targetPath).toString();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return JSON.parse(dataFromJson).body;
}

type TSearchKey =
    | '"body": "'
    | '"keyRawName": "';

export function initNlsDefMap(filename: TSupportDoc, searchKey: TSearchKey): ReadonlyMap<string, [vscode.Location]> {
    const mm = new Map<string, [vscode.Location]>();
    //
    const targetPath: string = getNlsPath(filename);
    const uri: vscode.Uri = vscode.Uri.file(targetPath);
    const dataList: string[] = fs.readFileSync(targetPath).toString()
        .split('\n');

    for (const [line, text] of dataList.entries()) {
        const i: number = text.indexOf(searchKey);
        if (i >= 0) {
            const character: number = i + searchKey.length;
            const upKey: string = text.trim()
                .replace(searchKey, '')
                .replace('",', '')
                .toUpperCase();
            mm.set(upKey, [
                new vscode.Location(
                    uri,
                    new vscode.Range(
                        new vscode.Position(line, character),
                        new vscode.Position(line, character + upKey.length),
                    ),
                ),
            ]);
        }
    }

    return mm;
}

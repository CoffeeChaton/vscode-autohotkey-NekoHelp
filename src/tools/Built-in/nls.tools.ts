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

type TSupportDoc = 'func';

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

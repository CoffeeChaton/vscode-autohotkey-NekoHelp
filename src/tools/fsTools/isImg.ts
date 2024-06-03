import * as path from 'node:path';

const imagesSet: ReadonlySet<string> = new Set(
    [
        // all need to use toLowerCase
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.bmp',
        '.webp',
        '.svg',
        //
        // vscode not work of it
        //
        // '.heic',
        // '.avif',
        // '.ico',
    ],
);

export function isImg(fsPath: string): boolean {
    const extname: string = path.extname(fsPath).toLowerCase();
    return imagesSet.has(extname);
}

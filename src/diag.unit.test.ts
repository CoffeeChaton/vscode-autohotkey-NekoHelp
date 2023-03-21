/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }] */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as fs from 'node:fs';
import * as path from 'node:path';
// import * as url from 'node:url';
import { Diags } from './diag';

describe('check diag-md uri', () => {
    it('check :diag-uri', () => {
        expect.hasAssertions();

        const errList0: string[] = [];

        const absolutePath: string = path.join(__dirname, '../note');
        const files: string[] = fs.readdirSync(absolutePath);
        const fileList: string[] = [];
        for (const file of files) {
            if (!file.endsWith('.md')) {
                errList0.push(`not md: ${file}`);
            }

            fileList.push(file);
        }

        for (const [k, v] of Object.entries(Diags)) {
            const uri: string = v.path;
            if (uri.startsWith('https://www.autohotkey.com/docs/v1/')) {
                continue;
            }
            if (!uri.endsWith('.md')) {
                errList0.push(`${k}--not ent with.md--`);
                continue;
            }
            if (!uri.startsWith('https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/')) {
                errList0.push(`${k}--not start with my github--`);
                continue;
            }
            const fileName: string = uri.replace(
                'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/',
                '',
            );
            if (!fileList.includes(fileName)) {
                errList0.push(`${k}--err253--not-match--`);
            }
        }

        expect(errList0).toStrictEqual([
            'not md: ahk', // Too lazy to distinguish whether it is a folder
            'not md: config',
            'not md: img',
        ]);

        expect(fileList).toStrictEqual([
            'ahk',
            'code107.md',
            'code118.md',
            'code121.md',
            'code122.md',
            'code124.md',
            'code125.md',
            'code126.md',
            'code127.md',
            'code201.md',
            'code304.md',
            'code506.md',
            'code507.md',
            'code601.md',
            'config',
            'img',
            'README.md',
        ]);
    });

    it('should clear note#diagnostic', () => {
        // note/README.md#diagnostic
        // https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/blob/main/note/README.md#diagnostic
        expect.hasAssertions();

        const today: Date = new Date();

        // eslint-disable-next-line no-magic-numbers
        const deadLine: Date = new Date(2023, 6, 1);
        // 2023-5-1

        const notDead: boolean = deadLine > today;

        expect(notDead).toBe(true);
    });
});

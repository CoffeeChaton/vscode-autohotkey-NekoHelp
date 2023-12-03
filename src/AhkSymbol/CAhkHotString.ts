import * as vscode from 'vscode';
import type { THotStringsOptions } from '../tools/Built-in/9_HotStrings_Options/HotStringsOptions.data';
import { HotStringsOptionsList } from '../tools/Built-in/9_HotStrings_Options/HotStringsOptions.data';
import type { TBaseLineParam } from './CAhkLine';

export type THotStrData = {
    /**
     * and `unknown option`
     */
    md: vscode.MarkdownString,
    range: vscode.Range,
};

/**
 * @example ::ts,:: typescript
 */
export class CAhkHotString extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    public readonly AfterString: string;

    declare public readonly kind: vscode.SymbolKind.Event;

    declare public readonly detail: 'HotString';

    declare public readonly children: never[];

    #opt: readonly THotStrData[] | null = null;

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TBaseLineParam,
        AfterString: string,
    ) {
        super(name, 'HotString', vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
        this.AfterString = AfterString;
        this.getOption();
    }

    public getOption(): readonly THotStrData[] {
        const oldDat: readonly THotStrData[] | null = this.#opt;
        if (oldDat !== null) {
            return oldDat;
        }
        //
        const { name, selectionRange } = this;
        const { line, character } = selectionRange.start;
        const need: THotStrData[] = [];
        const left: string = name.slice(1, name.indexOf(':', 1));
        const { length } = left;
        for (let i = 0; i < length; i += 0) { // hi~
            const s = left.slice(i);
            if (s.startsWith(' ') || s.startsWith('\t')) {
                i++;
                continue;
            }

            let isParser = false;
            for (const r of HotStringsOptionsList) {
                const {
                    parseFn,
                    doc,
                    exp,
                    humanName,
                    link,
                } = r;
                const z: THotStringsOptions | null = parseFn(s);
                if (z === null) continue;

                const newPos = z.length + i;
                const md = new vscode.MarkdownString('', true)
                    .appendMarkdown(`[${humanName}](${link})\n\n`)
                    .appendMarkdown(doc)
                    .appendMarkdown('\n\nexp:')
                    .appendCodeblock(exp);
                const range: vscode.Range = new vscode.Range(
                    new vscode.Position(line, character + i),
                    new vscode.Position(line, character + newPos),
                );
                need.push({ md, range });
                i = newPos; // hi~
                isParser = true;
                break;
            }
            if (!isParser) {
                const md = new vscode.MarkdownString('unknown option', true)
                    .appendMarkdown(`\`${s}\``);
                const range: vscode.Range = new vscode.Range(
                    new vscode.Position(line, character + i),
                    new vscode.Position(line, character + i + 1),
                );
                need.push({ md, range });
                i++;
            }
        }

        this.#opt = need;
        return need;
    }
}

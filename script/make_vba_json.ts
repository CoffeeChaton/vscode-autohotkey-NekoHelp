/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
import * as fs from 'node:fs';
import * as path from 'node:path';

export type TBase = {
    api_name: string,
    main: string,
    /** and with `.md` */
    file_name: string,
};

export type TMdDataBase = TBase & {
    // normal
    kind: 'collection',
};

export type TEnum = TBase & {
    kind: 'enumeration',
    /** just name */
    enum_ch: string[],
    // also can let ^title:.*enumeration \(
};

export type TObject = TBase & {
    kind: 'object',
    //
    Events: string[],
    Methods: string[],
    Properties: string[],
};

export type TOther = TBase & {
    kind: 'method' | 'property' | 'event',
    //
    Parameters: string[],

    /**
     * is
     * file_name like `Excel.Range(object).md`  ; Returns a **[Range](Excel.Range(object).md)**
     * or
     * base type like `string|double`
     */
    Return_value: string[],
};

export type TApiMeta = TMdDataBase | TObject | TEnum | TOther;

type TObjCh = {
    need: string[],
    line: number,
};

function getObjCh(dataList: string[], startLine: number, regCase: 1 | 2): TObjCh {
    const { length } = dataList;
    const need: string[] = [];
    let line = startLine;
    for (line = startLine + 1; line < length; line++) {
        const s2: string = dataList[line];
        if (s2 === '') continue;
        if (s2.startsWith('##')) break;

        const ma: RegExpMatchArray | null = regCase === 1
            ? s2.match(/^-\s*\[([^\]]+)\]|^\|\s*\[([^\]]+)\]/u)
            : s2.match(/^\|\s*_(\w+)_\s*\|/u);
        if (ma === null) continue;
        const maa: string = ma[1] ?? ma[2] ?? '';
        if (maa !== '') need.push(maa);
    }

    line -= 1;
    return {
        need,
        line,
    };
}

function getReturn_value(main: string): string[] {
    const arr: string[] = [];
    for (const ma of main.matchAll(/\*{2}([\w.()[\]]+)\*{2}/gu)) {
        const ma1: string = ma[1].includes('(')
            ? ma[1].replace(/[^(]*\(/u, '') // "[Range](Excel.Range(object).md)" -> "Excel.Range(object).md)"
                .replace(/\)$/u, '') // -> "Excel.Range(object).md)" -> "Excel.Range(object).md"
            : ma[1];

        let has = false;
        for (const k of arr) {
            if (k.includes(ma1)) {
                // "Return_value": [
                //     "Excel.Application(object).md",
                //     "Application"  <-------- i don't want this, but it can't just use js-set do it.
                // ]
                has = true;
                break;
            }
        }
        if (!has) {
            arr.push(ma1);
        }
    }

    return [...arr];
}

function getEnum_ch(main: string): string[] {
    const set = new Set<string>();

    for (const s of main.split('\n')) {
        const s0: string | undefined = s.split('|').at(1);
        if (
            s0 === undefined
            || s0.trim() === 'Name'
            || s0.trim().startsWith(':-')
        ) continue;
        const e: string = s0.trim()
            .replace(/^_+/u, '')
            .replace(/_+$/u, '')
            .replace(/^\*+/u, '')
            .replace(/\*+$/u, '');

        set.add(e);
    }
    return [...set];
}

/**
 * @param source_path https://github.com/MicrosoftDocs/VBA-Docs/tree/main/api
 * @param export_path pleas check `Excel.json` ...etc exist
 */
export function make_vba_json(source_path: string, export_path: string): void {
    const bigObj: Record<string, TApiMeta[]> = {
        Excel: [],
        Office: [],
        Outlook: [],
        Publisher: [],
        Visio: [],
        Word: [],
        unknown: [],
    };
    const fsPath: string = source_path;

    const files: string[] = fs.readdirSync(fsPath);
    for (const file_name of files) {
        if (!file_name.endsWith('.md')) continue;
        // const fullPath = `${fsPath}/${file}`;
        const fullPath = `${fsPath}${path.sep}${file_name}`;

        const dataList: string[] = fs.readFileSync(fullPath)
            .toString()
            .split('\n');
        const { length } = dataList;

        // ----
        let inHead = false;
        let title = '';
        let kind = '';
        let api_name = '';

        let inMain = false;
        let main = '';
        const Events: string[] = [];
        const Methods: string[] = [];
        const Properties: string[] = [];
        const Parameters: string[] = [];
        for (let line = 0; line < length; line++) {
            const s: string = dataList[line];
            if (s === '---') {
                inHead = !inHead;
            }
            if (inHead) {
                if (s.startsWith('title: ')) {
                    title = s.replace('title: ', '');
                    kind = title.match(/ (\w+) /iu)?.[1] ?? '';
                    continue;
                }
                if (s.startsWith('api_name:')) {
                    api_name = dataList[line + 1].replace('- ', '');
                    continue;
                }

                continue;
            }

            if (s.startsWith('# ')) {
                inMain = true;
                continue;
            }

            if (s.startsWith('## ')) {
                inMain = false;
                if (s.startsWith('## Events')) {
                    const ch: TObjCh = getObjCh(dataList, line, 1);
                    line = ch.line;
                    Events.push(...ch.need);
                } else if (s.startsWith('## Methods')) {
                    const ch: TObjCh = getObjCh(dataList, line, 1);
                    line = ch.line;
                    Methods.push(...ch.need);
                } else if (s.startsWith('## Properties')) {
                    const ch: TObjCh = getObjCh(dataList, line, 1);
                    line = ch.line;
                    Properties.push(...ch.need);
                } else if (s.startsWith('## Parameters')) {
                    const ch: TObjCh = getObjCh(dataList, line, 2);
                    line = ch.line;
                    Parameters.push(...ch.need);
                }
            }

            if (inMain && s !== '') main += `${s}\n`;
        }

        if (api_name === '') continue;

        // eslint-disable-next-line dot-notation
        const need: TApiMeta[] = bigObj[api_name.replace(/\..*/u, '')] ?? bigObj['unknown'];
        switch (kind) {
            case 'collection':
                need.push({
                    api_name,
                    file_name,
                    kind,
                    main,
                });
                break;
            case 'enumeration':
                need.push({
                    api_name,
                    enum_ch: getEnum_ch(main),
                    file_name,
                    kind,
                    main,
                });
                break;

            case 'object':
                need.push({
                    api_name,
                    Events,
                    file_name,
                    kind,
                    main,
                    Methods,
                    Properties,
                });
                break;

            case 'method':
            case 'property':
            case 'event':
                need.push({
                    api_name,
                    file_name,
                    kind,
                    main,
                    Parameters,
                    Return_value: getReturn_value(main),
                });
                break;
            default:
                break;
        }
    }

    const space4 = 4;
    for (const [k, v] of Object.entries(bigObj)) {
        fs.writeFileSync(`${export_path}${path.sep}${k}.json`, JSON.stringify([...v.values()], null, space4));
    }
}

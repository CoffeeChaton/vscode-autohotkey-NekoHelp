/* eslint-disable max-depth */
import * as fs from 'node:fs';
import type * as vscode from 'vscode';
import type { TApiMeta } from '../../../../script/make_vba_json';
import type { TVba2Map } from './type';
import { vbaObj2LikeMethod } from './vbaObj';

/**
 * 1. size only 1, Avoid taking up too much memory
 * 2. at my main ahk before vbaEx, only 50.4 MB (at dev mode loop 20 , Maximum moment 181 MB, after 10 sec ... gc free to 50.4MB)
 * 3. only excel.json -> 53.4 MB
 */
const VbaMemo = new Map<string, TVba2Map>();

// -------------

function getVbaData(filePath: string): TVba2Map {
    const cache: TVba2Map | undefined = VbaMemo.get(filePath);
    if (cache !== undefined) return cache;

    const api_nameMap = new Map<string, TApiMeta[]>();
    const file_nameMap = new Map<string, TApiMeta>();

    const dataFromJson: string = fs.readFileSync(filePath).toString();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const arr: TApiMeta[] = JSON.parse(dataFromJson) as TApiMeta[];

    for (const e of arr) {
        const { api_name, file_name } = e;
        //
        const apiUpName: string = api_name.toUpperCase();
        const oldApiArray: TApiMeta[] = api_nameMap.get(apiUpName) ?? [];
        oldApiArray.push(e);

        api_nameMap.set(apiUpName, oldApiArray);
        file_nameMap.set(file_name, e);
    }
    /** size only 1, Avoid taking up too much memory */
    VbaMemo.clear();
    const value = {
        api_nameMap,
        file_nameMap,
    };
    VbaMemo.set(filePath, value);
    return value;
}

function vbaCompletionDeep1(
    api_list: TApiMeta[],
    Vba2Map: TVba2Map,
): vscode.CompletionItem[] {
    const list: vscode.CompletionItem[] = [];

    for (const api_e of api_list) {
        if (api_e.kind === 'object') {
            list.push(
                ...vbaObj2LikeMethod('method', api_e.Methods, api_e, Vba2Map),
                ...vbaObj2LikeMethod('event', api_e.Events, api_e, Vba2Map),
                ...vbaObj2LikeMethod('property', api_e.Properties, api_e, Vba2Map),
            );
        }
    }
    return list;
}

export function vbaCompletion(
    filePath: string,
    api_name_up: string,
    ChapterArr: readonly string[],
): vscode.CompletionItem[] {
    const Vba2Map: TVba2Map = getVbaData(filePath);

    const api_list: TApiMeta[] | undefined = Vba2Map.api_nameMap.get(api_name_up);
    if (api_list === undefined) return [];
    console.log('🚀 ~ d1:', { ChapterArr, api_list });

    if (ChapterArr.length === 1) {
        return vbaCompletionDeep1(api_list, Vba2Map);
    }
    //
    // const list: vscode.CompletionItem[] = [];

    return [];
}

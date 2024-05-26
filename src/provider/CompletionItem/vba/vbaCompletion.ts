/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
import type * as vscode from 'vscode';
import type { TApiMeta, TObject, TOther } from '../../../../script/make_vba_json';
import { getVbaData } from './getVbaData';
import type { TVba2Map } from './type';
import { vbaObj2LikeMethod } from './vbaObj';

export function vbaCompletionDeep1(
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
        // TODO
    }
    return list;
}

function searchFromReturn_value(Vba2Map: TVba2Map, Return_value: readonly string[]): TApiMeta[] {
    const list: TApiMeta[] = [];

    const { file_nameMap } = Vba2Map;
    for (const return_value of Return_value) {
        const api_e: TApiMeta | undefined = file_nameMap.get(return_value.toUpperCase());
        if (api_e === undefined) continue;
        list.push(api_e);
    }

    return list;
}

// eslint-disable-next-line max-params
function vbaObjSearchAllCh(
    ChapterArr: readonly string[],
    deep: number,
    api_e: TObject,
    Vba2Map: TVba2Map,
    kind: 'method' | 'property' | 'event', // obj only has
    chList: readonly string[],
    /*
     * eval
     */
    need: TApiMeta[][],
): void {
    const { api_nameMap } = Vba2Map;
    const deepS: string = ChapterArr[deep];
    for (const ch_name of chList) {
        if (deepS !== ch_name.toUpperCase()) continue;

        const searchKey = `${api_e.api_name}.${ch_name}`;
        const data: TOther | undefined = api_nameMap
            .get(searchKey.toUpperCase())
            ?.find((f): f is TOther => f.kind === kind);
        if (data === undefined) continue;

        const needDeep: TApiMeta[] = need.at(deep) ?? [];
        needDeep.push(...searchFromReturn_value(Vba2Map, data.Return_value));

        /**
         * i know is eval
         */
        // eslint-disable-next-line no-param-reassign
        need[deep] = needDeep;
    }
}

export function vbaCompletion(
    filePath: string,
    api_name_up: string,
    ChapterArr: readonly string[],
): TApiMeta[][] {
    const Vba2Map: TVba2Map = getVbaData(filePath);

    const api_list: TApiMeta[] | undefined = Vba2Map.api_nameMap.get(api_name_up);
    if (api_list === undefined) return [];

    const need: TApiMeta[][] = [api_list];
    if (ChapterArr.length === 1) return need; // return vbaCompletionDeep1(api_list, Vba2Map);

    for (let deep = 1; deep < ChapterArr.length; deep++) {
        for (const api_e of need[deep - 1]) {
            if (api_e.kind === 'object') {
                vbaObjSearchAllCh(ChapterArr, deep, api_e, Vba2Map, 'property', api_e.Properties, need);
                vbaObjSearchAllCh(ChapterArr, deep, api_e, Vba2Map, 'method', api_e.Methods, need);
                vbaObjSearchAllCh(ChapterArr, deep, api_e, Vba2Map, 'event', api_e.Events, need);
                continue;
            }
            if (api_e.kind === 'method' || api_e.kind === 'event' || api_e.kind === 'property') {
                const needDeep: TApiMeta[] = need.at(deep) ?? [];
                needDeep.push(...searchFromReturn_value(Vba2Map, api_e.Return_value));

                /**
                 * i know is eval
                 */
                // eslint-disable-next-line no-param-reassign
                need[deep] = needDeep;
                continue;
            }
            // TODO
            if (api_e.kind === 'enumeration') {
                continue;
            }
            if (api_e.kind === 'collection') {
                //
            }
        }
    }
    return need;
}

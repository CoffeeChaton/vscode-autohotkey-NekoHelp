/* eslint-disable max-lines-per-function */
/* eslint-disable max-depth */
import type { TApiMeta, TObject, TOther } from '../../../../script/make_vba_json';
import { enumLog } from '../../../tools/enumErr';
import type { CVbaCompletionItem } from './2Completion/CVbaCompletionItem';
import { vbaEnum2Completion } from './2Completion/vbaEnum';
import { vbaObj2Completion } from './2Completion/vbaObj';
import { getVbaData } from './getVbaData';
import type { TVba2Map } from './type';
import type { TVbaDataLast } from './valTrackFn';

export function vbaCompletionDeep1(
    data: TVbaDataLast,
): CVbaCompletionItem[] {
    const { api_list, Vba2Map, filePath } = data;
    const list: CVbaCompletionItem[] = [];

    for (const api_e of api_list) {
        if (api_e.kind === 'object') {
            list.push(
                ...vbaObj2Completion('method', api_e.Methods, api_e, Vba2Map, filePath),
                ...vbaObj2Completion('event', api_e.Events, api_e, Vba2Map, filePath),
                ...vbaObj2Completion('property', api_e.Properties, api_e, Vba2Map, filePath),
            );
            continue;
        }
        if (api_e.kind === 'enumeration') {
            list.push(...vbaEnum2Completion(api_e, filePath));
            continue;
        }
        if (api_e.kind === 'method' || api_e.kind === 'property' || api_e.kind === 'event') {
            //
            continue;
        }
        if (api_e.kind === 'collection') {
            //
            continue;
        }
        enumLog(api_e.kind, 'vbaCompletionDeep1');

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
                need[deep] = needDeep;
                continue;
            }
            if (api_e.kind === 'enumeration') {
                // not return ch...just enum.ch
                continue;
            }
            if (api_e.kind === 'collection') {
                // not return ch
                continue;
            }
            enumLog(api_e.kind, 'vbaCompletion');
        }
    }
    return need;
}

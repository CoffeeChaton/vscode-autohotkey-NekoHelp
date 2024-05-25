import type { TApiMeta } from '../../../../script/make_vba_json';

export type TVba2Map = {
    api_nameMap: Map<string, TApiMeta[]>,
    file_nameMap: Map<string, TApiMeta>,
};

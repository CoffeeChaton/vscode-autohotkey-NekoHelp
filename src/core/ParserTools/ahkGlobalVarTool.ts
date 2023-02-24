import { pm } from '../ProjectManager';

type TData = {
    fsPathList: string[],
    keyRawName: string,
    // and any you want to has Data
};

export type TGlobalVarUpNameMap = ReadonlyMap<string, TData>;

export function getGlobalUpNameMap(): TGlobalVarUpNameMap {
    const map = new Map<string, TData>();

    for (const { ModuleVar, uri } of pm.getDocMapValue()) {
        for (const [k, { keyRawName }] of ModuleVar.ModuleValMap) {
            const oldData: TData | undefined = map.get(k);
            const fsPathList: string[] = oldData === undefined
                ? [uri.toString()]
                : [...oldData.fsPathList, uri.toString()];

            map.set(k, {
                fsPathList,
                keyRawName,
            });
        }
        //
    }

    return map;
}

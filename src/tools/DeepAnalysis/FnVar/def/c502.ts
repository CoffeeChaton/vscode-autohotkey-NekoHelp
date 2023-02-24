import type { TC502New } from '../../../../AhkSymbol/CAhkFunc';

/**
 * @param oldRawName don't input UpName, and this is first def name
 * @param RawName don't input UpName.
 * @returns not warn return 0, else return show warn name.
 */
export function newC502(oldRawName: string, RawName: string): TC502New {
    return oldRawName === RawName
        ? 0 // OK
        : RawName; // wean username
}

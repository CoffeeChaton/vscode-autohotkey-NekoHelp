import type { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import type { TFullClassMap } from '../../../tools/DeepAnalysis/getUserDefTopClassSymbol';
import { ToUpCase } from '../../../tools/str/ToUpCase';

export function valTrackMethod(
    nameList: readonly string[],
    fullClassMap: TFullClassMap,
): readonly CAhkClass[] {
    const classList: CAhkClass[] = [];

    for (const name of nameList) {
        const c0: CAhkClass | undefined = fullClassMap.get(ToUpCase(name));
        if (c0 !== undefined) {
            classList.push(c0);
        }
    }

    return classList;
}

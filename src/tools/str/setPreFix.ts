import { EPrefix } from '../MD/setMD';

export function setPreFix(isByRef: boolean, isVariadic: boolean): EPrefix {
    if (isByRef) {
        return isVariadic
            ? EPrefix.ByRefVariadicParam
            : EPrefix.ByRefParam;
    }

    return isVariadic
        ? EPrefix.ByRefVariadicParam
        : EPrefix.Param;
}

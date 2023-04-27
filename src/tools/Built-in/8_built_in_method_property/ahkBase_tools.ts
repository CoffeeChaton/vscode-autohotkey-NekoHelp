/* eslint-disable no-param-reassign */

export type TAhkBaseObj = {
    ahkArray: boolean,
    ahkFileOpen: boolean,
    ahkFuncObject: boolean,
    ahkBase: boolean,
    ahkCatch: boolean, // https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception
};

export function ahkBaseUp(strPart: string, Obj: TAhkBaseObj): TAhkBaseObj {
    // fileOpen() https://www.autohotkey.com/docs/v1/lib/FileOpen.htm
    // file := FileOpen(Filename, Flags , Encoding)
    //          ^
    if (!Obj.ahkFileOpen && (/^FileOpen\(/iu).test(strPart)) {
        Obj.ahkFileOpen = true;
        Obj.ahkBase = true;
        return Obj;
    }
    // https://www.autohotkey.com/docs/v1/lib/Func.htm
    // FunctionReference := Func(FunctionName)
    //                       ^
    if (!Obj.ahkFuncObject && (/^Func\(/iu).test(strPart)) {
        Obj.ahkFuncObject = true;
        Obj.ahkBase = true;
        return Obj;
    }
    // https://www.autohotkey.com/docs/v1/lib/Array.htm
    // Array := [Item1, Item2, ..., ItemN]
    //          ^ ; this `[`
    if (!Obj.ahkArray && (strPart.startsWith('[') || (/^Array\(/iu).test(strPart))) {
        Obj.ahkArray = true;
        Obj.ahkBase = true;
        return Obj;
    }

    // https://www.autohotkey.com/docs/v1/Objects.htm#Usage_Freeing_Objects
    // obj := {}  ; Creates an object.
    //        ^ ; this `{'
    //
    // obj1 := Object()
    //            ^
    if (!Obj.ahkBase && (strPart.startsWith('{') || (/^Object\(/iu).test(strPart))) {
        Obj.ahkBase = true;
        return Obj;
    }

    // https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception
    // err := Exception()
    // err.message = "some error"
    // throw err
    //
    // catch e use valTrackCore() to search
    if (!Obj.ahkCatch && (/^Exception\(/iu).test(strPart)) {
        Obj.ahkCatch = true;
        return Obj;
    }

    return Obj;
}

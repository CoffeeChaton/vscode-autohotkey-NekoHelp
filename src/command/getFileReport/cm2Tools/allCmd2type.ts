import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TFuncRef } from '../../../provider/Def/getFnRef';
import type { TBiFuncMsg } from '../../../tools/Built-in/func.tools';

export type TRefUseDef = Map<string, [readonly TFuncRef[], CAhkFunc]>;
export type TRefJustBy2 = Map<string, [readonly TFuncRef[], CAhkFunc]>;
export type TRefBuiltInFn = Map<string, [readonly TFuncRef[], TBiFuncMsg]>;
export type TRefUnknown = Map<string, readonly TFuncRef[]>;

import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TFuncRef } from '../../../provider/Def/getFnRef';
import type { TBiFuncMsg } from '../../../tools/Built-in/func.tools';

export type TRefUseDef = Map<string, [TFuncRef[], CAhkFunc]>;
export type TRefJustBy2 = Map<string, [TFuncRef[], CAhkFunc]>;
export type TRefBuiltInFn = Map<string, [TFuncRef[], TBiFuncMsg]>;
export type TRefUnknown = Map<string, TFuncRef[]>;

import type { CAhkClass, CAhkClassGetSet, CAhkClassInstanceVar } from './CAhkClass';
import type { CAhkFunc } from './CAhkFunc';
import type { CAhkHotString } from './CAhkHotString';
import type {
    CAhkComment,
    CAhkHotKeys,
} from './CAhkLine';
import type { CAhkCase, CAhkDefault, CAhkSwitch } from './CAhkSwitch';
import type { TLineClass } from './TLineClass';

export type TAhkSymbol =
    | CAhkCase
    | CAhkClass
    | CAhkClassGetSet
    | CAhkClassInstanceVar
    | CAhkDefault
    | CAhkFunc
    | CAhkHotKeys
    | CAhkHotString
    | CAhkSwitch
    | TLineClass;

export type TTopSymbol =
    | CAhkClass
    | CAhkComment
    | CAhkFunc
    | CAhkHotKeys
    | CAhkHotString
    | CAhkSwitch
    | TLineClass;
export type TAstRoot = readonly TTopSymbol[];

export type TAhkSymbolList = TAhkSymbol[];

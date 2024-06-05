import type {
    CAhkClass,
    CAhkClassInstanceVar,
    CAhkClassPropertyDef,
    CAhkClassPropertyGetSet,
} from './CAhkClass';
import type { CAhkFunc } from './CAhkFunc';
import type { CAhkHotKeys } from './CAhkHotKeys';
import type { CAhkHotString } from './CAhkHotString';
import type { CAhkComment } from './CAhkLine';
import type { CAhkCase, CAhkDefault, CAhkSwitch } from './CAhkSwitch';
import type { TLineClass } from './TLineClass';

export type TAhkSymbol =
    | CAhkClassPropertyGetSet
    | CAhkCase
    | CAhkClass
    | CAhkClassPropertyDef
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

import type { CAhkInclude } from './CAhkInclude';
import type { CAhkComment, CAhkDirectives, CAhkLabel } from './CAhkLine';

export type TLineClass =
    | CAhkComment
    | CAhkDirectives
    | CAhkInclude
    | CAhkLabel;

import type { DeepReadonly } from '../../globalEnum';
/*
```ahk
::t3{{::
    SendRaw, { testC
Return

::t4}}::{{{{{{}}}}}}

::t5(((::
    SendRaw, t5 (((((
    SendRaw, t6 }}}}
Return
```
*/

const CLL: DeepReadonly<RegExp[]> = [
    /^[,.?]/u,
    /^:[^:]/u, // ? : Ternary operation -> ':' // if (hasDoubleSemicolon === true)  will not goto this line.
    /^\+[^+]/u, // +
    /^-[^-]/u, // -
    /^\*[^/]/u, // /^*  but not */
    /^\//u, // /
    /^and\s/iu, //
    /^or\s/iu, // in edge cases, someone used `new` as a variable name
    /^\|\|/u, // ||
    /^&&/u, // &&
    /^[!~&/<>|^]/u,
    /^new\s+(?!:?=)/iu, // in edge cases, someone used `new` as a variable name
    /^not\s+/iu, // in edge cases, someone used `new` as a variable name
    // Don't do it /^%/, because ``` %i%Name := ... ```
];

export function ContinueLongLine(textFix: string): 0 | 1 {
    // [ContinueLongLine](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation)

    return CLL.some((reg: Readonly<RegExp>) => reg.test(textFix))
        ? 1
        : 0;
}

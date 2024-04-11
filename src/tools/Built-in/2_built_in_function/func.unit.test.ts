/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */
import { describe, expect, it } from '@jest/globals';
import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
import { funcDataList } from './func.data';

type TErrObj = {
    msg: string,
    value: unknown,
};

describe('check BuiltInFunctionObj ruler', () => {
    it('exp : ABS() .. WinExist()', () => {
        expect.hasAssertions();

        const errList: TErrObj[] = [];
        for (const v of funcDataList) {
            const {
                keyRawName,
                insert,
                exp,
                upName,
            } = v;

            const v1 = upName.toUpperCase() !== upName;
            const v2 = keyRawName.toUpperCase() !== upName;
            const v3 = !insert.startsWith(keyRawName);
            const v4 = !exp.join('\n').includes(keyRawName);
            if (v1 || v2 || v3 || v4) {
                errList.push({
                    msg: '--04--85--15--15',
                    value: {
                        v1,
                        v2,
                        v3,
                        v4,
                        upName,
                        v,
                    },
                });
            }
        }

        expect(errList).toHaveLength(0);
    });

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const arr1: string[] = funcDataList.map((v): string => v.keyRawName);

        const st1 = repository.func_call.patterns[2].match
            .replace('(?<![.`%#])\\b(?i:', '')
            .replace(')(?=\\()\\b', '');

        const max = 115;

        expect(funcDataList).toHaveLength(max);
        expect(st1).toBe(arr1.join('|'));
    });

    it('check : sign', () => {
        expect.hasAssertions();

        const voidFn: string[] = [];
        const errList: string[] = [];
        for (const v of funcDataList) {
            const { keyRawName, sign } = v;

            if (!(/^\w+\s:=\s/u).test(sign)) {
                //
                voidFn.push(`${keyRawName}()`);
            }

            const signFix: string = sign.replace(/^\w+\s:=\s/u, '');

            if (!signFix.startsWith(`${keyRawName}(`) || !signFix.endsWith(')')) {
                errList.push(`${keyRawName}  startsWith endWith`);
                continue;
            }

            const param: string = signFix
                .replace(`${keyRawName}(`, '')
                .replace(/\)$/u, '');

            if (param === '') continue;

            if (param.includes('[') && !param.includes(']')) {
                errList.push(`${keyRawName}  miss ]`);
                continue;
            }

            if (!param.includes('[') && param.includes(']')) {
                errList.push(`${keyRawName}  miss [`);
                continue;
            }

            const paramList: string[] = param
                .replaceAll('[', '')
                .replaceAll(']', '')
                .split(',')
                .map((s: string): string => (
                    s
                        .replace(/^\s*ByRef\s*/u, '')
                        .replace(/:=.*/u, '')
                        .trim()
                ));

            const someParam: string | undefined = paramList
                .find((s: string): boolean => !(/^\w+\*?$/u).test(s));
            if (someParam !== undefined) {
                errList.push(`${keyRawName}() , ${someParam} style`);
            }

            const pp: string | undefined = [...paramList]
                .slice(0, paramList.length - 1)
                .find((s: string) => s.endsWith('*'));
            if (pp !== undefined) {
                errList.push(`${keyRawName}() , ${pp} `);
            }
        }

        expect(errList).toStrictEqual([]);
        expect(voidFn).toStrictEqual([
            'ComObjConnect()',
            'ObjRawSet()',
            'ObjSetBase()',
            'OnClipboardChange()',
            'ComObjMissing()',
            'ComObjParameter()',
            'ComObjEnwrap()',
            'ComObjUnwrap()',
        ]);
    });

    it('check : uri', () => {
        expect.hasAssertions();

        type TSpecialUri = [
            string,
            typeof funcDataList[number]['link'],
        ];
        const specialUriList: TSpecialUri[] = [];
        for (const v of funcDataList) {
            const { link, keyRawName, group } = v;

            if (group === 'Math' || group === '△Math') {
                const id = link
                    .replace('https://www.autohotkey.com/docs/v1/lib/Math.htm#', '');
                if (id !== keyRawName) {
                    specialUriList.push([keyRawName, link]);
                }
                continue;
            }
            if (group === 'TreeView') {
                const id = link
                    .replace('https://www.autohotkey.com/docs/v1/lib/TreeView.htm#', '');
                if (id !== keyRawName) {
                    specialUriList.push([keyRawName, link]);
                }
                continue;
            }
            if (group === 'ListView') {
                const id = link
                    .replace('https://www.autohotkey.com/docs/v1/lib/ListView.htm#', '');
                if (id !== keyRawName) {
                    specialUriList.push([keyRawName, link]);
                }
                continue;
            }
            if (group === 'StatusBar') {
                const id = link
                    .replace('https://www.autohotkey.com/docs/v1/lib/GuiControls.htm#', '');
                if (id !== keyRawName) {
                    specialUriList.push([keyRawName, link]);
                }
                continue;
            }
            if (group === 'ImageLists') {
                const id = link
                    .replace('https://www.autohotkey.com/docs/v1/lib/ListView.htm#', '');
                if (id !== keyRawName) {
                    specialUriList.push([keyRawName, link]);
                }
                continue;
            }
            // if (group === 'Object') {
            //     const id = link
            //         .replace('https://www.autohotkey.com/docs/v1/lib/Object.htm#', '');
            //     if (id !== keyRawName.replace('Obj', '')) {
            //         specialUriList.push([keyRawName, link]);
            //     }
            //     continue;
            // }
            // other
            const tag = link
                .replace('https://www.autohotkey.com/docs/v1/lib/', '')
                .replace('.htm', '');
            if (tag !== keyRawName) {
                specialUriList.push([keyRawName, link]);
            }
        }

        expect(specialUriList).toStrictEqual([
            ['Array', 'https://www.autohotkey.com/docs/v1/Objects.htm#Usage_Simple_Arrays'],
            ['ComObject', 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm'],
            ['Exception', 'https://www.autohotkey.com/docs/v1/lib/Throw.htm#Exception'],
            // GetKeyName() / GetKeyVK() / GetKeySC()
            ['GetKeyName', 'https://www.autohotkey.com/docs/v1/lib/GetKey.htm'],
            ['GetKeySC', 'https://www.autohotkey.com/docs/v1/lib/GetKey.htm'],
            // GetKeyState() / GetKeyState
            ['GetKeyState', 'https://www.autohotkey.com/docs/v1/lib/GetKeyState.htm#function'],
            // GetKeyName() / GetKeyVK() / GetKeySC()
            ['GetKeyVK', 'https://www.autohotkey.com/docs/v1/lib/GetKey.htm'],
            // Trim() / LTrim() / RTrim()
            ['LTrim', 'https://www.autohotkey.com/docs/v1/lib/Trim.htm'],
            // Obj ch
            ['ObjGetBase', 'https://www.autohotkey.com/docs/v1/lib/Object.htm#GetBase'],
            ['ObjRawGet', 'https://www.autohotkey.com/docs/v1/lib/Object.htm#RawGet'],
            ['ObjRawSet', 'https://www.autohotkey.com/docs/v1/lib/Object.htm#RawSet'],
            // ObjAddRef() / ObjRelease()
            ['ObjRelease', 'https://www.autohotkey.com/docs/v1/lib/ObjAddRef.htm'],
            // Obj ch
            ['ObjSetBase', 'https://www.autohotkey.com/docs/v1/lib/Object.htm#SetBase'],
            // OnClipboardChange() / OnClipboardChange:
            ['OnClipboardChange', 'https://www.autohotkey.com/docs/v1/lib/OnClipboardChange.htm#function'],
            // OnExit() / OnExit
            ['OnExit', 'https://www.autohotkey.com/docs/v1/lib/OnExit.htm#function'],
            // Trim() / LTrim() / RTrim()
            ['RTrim', 'https://www.autohotkey.com/docs/v1/lib/Trim.htm'],
            ['ComObjMissing', 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm'],
            ['ComObjParameter', 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm'],
            ['ComObjEnwrap', 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm'],
            ['ComObjUnwrap', 'https://www.autohotkey.com/docs/v1/lib/ComObjActive.htm'],
        ]);
    });

    it('check : param startWith OutPut', () => {
        expect.hasAssertions();

        const snapshotList: [fnName: string, paramName: string, i: number][] = [];
        for (const v of funcDataList) {
            const { keyRawName, sign } = v;

            const param: string = sign
                .replace(/^\w+\s:=\s/u, '')
                .replace(`${keyRawName}(`, '')
                .replace(/\)$/u, '');

            if (param === '') continue;

            const paramList: string[] = param
                .replaceAll('[', '')
                .replaceAll(']', '')
                .split(',')
                .map((s: string): string => (
                    s
                        .replace(/^\s*ByRef\s*/u, '')
                        .replace(/:=.*/u, '')
                        .trim()
                ));

            for (const [i, paramName] of paramList.entries()) {
                if ((/out/iu).test(paramName)) {
                    snapshotList.push([keyRawName, paramName, i]);
                }
            }
        }

        expect(snapshotList).toStrictEqual([
            ['LV_GetText', 'OutputVar', 0],
            ['RegExMatch', 'OutputVar', 2],
            ['RegExReplace', 'OutputVarCount', 3],
            ['StrReplace', 'OutputVarCount', 3],
            ['TV_GetText', 'OutputVar', 0],
        ]);
    });
});

import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
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

        const st1 = (repository.func_call.patterns[0].match)
            .replace('(?<![.`%#])\\b(?i:', '')
            .replace(')(?=\\()\\b', '');

        const max = 111;

        expect(funcDataList).toHaveLength(max);
        expect(st1).toBe(arr1.join('|'));
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
        ]);
    });
});

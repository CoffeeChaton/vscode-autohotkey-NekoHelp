/* eslint-disable no-magic-numbers */
import { AVariablesList } from '../A_Variables.data';
import { BiVariables } from '../BiVariables.data';
import { LineCommand } from '../Command.data';
import { DirectivesList } from '../Directives.data';
import { funcDataList } from '../func.data';
import { Statement } from '../statement.data';
import type { TIndexData } from './data_index.data';
import { indexData } from './data_index.data';

/**
 * An index entry counts as syntax element, if its third field is one of the following digits:
 *
 * [name,uri-like , human-readable , magic-number, sign]
 *
        0 - directive
        1 - built-in var
        2 - built-in function
        3 - control flow statement
        4 - operator
        5 - declaration [class,extends,global,local,static]
        6 - command
        7 - sub-command
        8 - built-in method/property
        99 - Ahk2Exe compiler
 */
const indexDataMap0 = new Map<string, TIndexData>();
const indexDataMap1 = new Map<string, TIndexData>();
const indexDataMap2 = new Map<string, TIndexData>();
const indexDataMap3 = new Map<string, TIndexData>();
// 4 - operator
// 5 - declaration [class,extends,global,local,static]
// 7 - sub-command
// 8 - built-in method/property
const indexDataMap6 = new Map<string, TIndexData>();
// 99 - Ahk2Exe compiler

// eslint-disable-next-line sonarjs/no-unused-collection
const arr7: TIndexData[] = [];

for (const Data of indexData) {
    const keyRawName: string = Data[0];
    const v2: number | undefined = Data[2];
    switch (v2) {
        case 0:
            indexDataMap0.set(keyRawName, Data);
            break;
        case 1:
            indexDataMap1.set(keyRawName, Data);
            break;
        case 2:
            indexDataMap2.set(keyRawName, Data);
            break;
        case 3:
            indexDataMap3.set(keyRawName, Data);
            break;
        case 6:
            indexDataMap6.set(keyRawName, Data);
            break;
        case 7:
            if (
                Data[0].includes('Transform')
                || Data[0].includes('(Gui)')
                || Data[0].includes('(GuiControl)')
                || Data[0].includes('(Menu)')
            ) {
                continue;
            }
            arr7.push(Data);
            break;

        default:
            break;
    }
}

describe('check cmd sign ruler', () => {
    it('check : 0 - directive', () => {
        expect.hasAssertions();

        const myList: string[] = DirectivesList.map(({ keyRawName }): `#${string}` => keyRawName);
        const doc: string[] = [...indexDataMap0.keys()];

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        expect(myList.sort()).toStrictEqual(doc.sort());
    });

    it('check : 1 - built-in var', () => {
        expect.hasAssertions();

        const myList: string[] = AVariablesList.map(({ body }): string => body);
        myList.push(
            ...BiVariables.map(({ keyRawName }): string => keyRawName),
        );
        const doc: string[] = [...indexDataMap1.keys(), 'this'];

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        expect(myList.sort()).toStrictEqual(doc.sort());
    });

    it('check : 2 - built-in function', () => {
        expect.hasAssertions();

        const myList: string[] = funcDataList.map(({ keyRawName }): string => `${keyRawName}()`);

        myList.push(
            // TODO...
            'ComObjEnwrap()',
            'ComObjMissing()',
            'ComObjParameter()',
            'ComObjUnwrap()',
            'ObjClone()',
            'ObjCount()',
            'ObjDelete()',
            'Object()',
            'ObjGetAddress()',
            'ObjGetCapacity()',
            'ObjHasKey()',
            'ObjInsert()',
            'ObjInsertAt()',
            'ObjLength()',
            'ObjMaxIndex()',
            'ObjMinIndex()',
            'ObjNewEnum()',
            'ObjPop()',
            'ObjPush()',
            'ObjRemove()',
            'ObjRemoveAt()',
            'ObjSetCapacity()',
        );
        const doc: string[] = [...indexDataMap2.keys()];

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        expect(myList.sort()).toStrictEqual(doc.sort());
    });

    it('check : 6 - command', () => {
        expect.hasAssertions();

        const myList: string[] = LineCommand.map(({ keyRawName }) => keyRawName);

        myList.push(
            // Documents are classified as `foc`, but not the same as numbers
            'Critical',
            'Exit',
            'ExitApp',
            'Pause',
            'Reload',
        );
        const doc: string[] = [...indexDataMap6.keys()];

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        expect(myList.sort()).toStrictEqual(doc.sort());
    });

    it('check : 3 - control flow statement', () => {
        expect.hasAssertions();

        const myList: string[] = Statement.map((v): string => v.keyRawName);

        myList.push(
            'For ... in',
            'Gosub',
            'If ... between ... and',
            'If ... contains',
            'If ... in',
            'If ... is not',
            'If ... is',
            'If ... not between ... and',
            'If ... not contains',
            'If ... not in',
            'Loop, Files',
            'Loop, Parse',
            'Loop, Read',
            'Loop, Reg',
        );

        const doc: string[] = [
            ...indexDataMap3.keys(),
            'For',
            // Documents are classified as `foc`, but not the same as numbers
            'Critical',
            'Exit',
            'ExitApp',
            'Pause',
            'Reload',
            'GoSub',
        ];

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        expect(myList.sort()).toStrictEqual(doc.sort());
    });

    it('check : 6 - cmd sign', () => {
        expect.hasAssertions();

        const errList0: string[] = [];
        const errListMain: string[] = [];

        for (const vv of LineCommand) {
            const { keyRawName, _paramType } = vv;
            const Data: TIndexData | undefined = indexDataMap6.get(keyRawName);

            if (Data === undefined) {
                errList0.push(`Data undefined , of '${keyRawName}'`);
                continue;
            }

            // eslint-disable-next-line no-magic-numbers
            const vSign: string | undefined = Data[3];
            if (vSign === undefined) {
                errList0.push(`vSign undefined , of '${keyRawName}'`);
                continue;
            }

            if (vSign !== _paramType.join('')) {
                errListMain.push(keyRawName);
            }
        }

        // expect(LineCommand).toHaveLength(cmdMap.size);
        expect(errList0).toStrictEqual([]);
        expect(errListMain).toStrictEqual([
            'Gui',
            'MsgBox', // multi-signature
            'OnExit', // OnExit() doc-error?
            'Progress', // multi-signature ruler ?
            'RegDelete', // old-Syntax
            'RegRead', // old-Syntax
            'RegWrite', // old-Syntax
            'SplashImage', // multi-signature ruler ?
            'StringSplit', // doc-error?
            'SysGet', // only of `SysGet, OutputVar, Monitor , N`
        ]);
    });

    it('check : need to check data as 2023-05-01', () => {
        expect.hasAssertions();

        const today: Date = new Date();

        // eslint-disable-next-line no-magic-numbers
        const deadLine: Date = new Date(2023, 6, 1);
        // 2023-5-1

        const notDead: boolean = deadLine > today;

        expect(notDead).toBe(true);
    });
});
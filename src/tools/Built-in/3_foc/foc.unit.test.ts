/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/require-array-sort-compare */
import { describe, expect, it } from '@jest/globals';
import * as foc_en from '../../../../doc/foc.en.ahk.json';
import * as foc_cn from '../../../../doc/foc.zh-cn.ahk.json';
import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
import type { TFocDiag, TStatementElement } from './foc.data';
import { Statement } from './foc.data';

/**
 * Capitalize<Lowercase<str>>;
 * X break
 * X BREAK
 * O Break
 */
function CapitalizeLowercase(str: string): string {
    return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

function isAllowList(keyRawName: string): boolean {
    if (keyRawName.startsWith('If')) return false;
    if (
        [
            'ExitApp',
            'GoSub',
        ].includes(keyRawName)
    ) {
        return false;
    }
    return keyRawName !== CapitalizeLowercase(keyRawName.toUpperCase());
}

type TDiagSnapshot = [
    string,
    TFocDiag,
];

function checkDiag(foc: TStatementElement[]): TDiagSnapshot[] {
    const snapshot: TDiagSnapshot[] = [];
    for (const v of foc) {
        const { diag, keyRawName } = v;

        if (diag !== undefined) {
            snapshot.push([keyRawName, diag]);
        }
    }
    return snapshot;
}

type TErrObj = {
    msg: string,
    value: unknown,
};

describe('check Statement ruler', () => {
    const max = 38;

    it(`check: size .EQ. ${max}`, () => {
        expect.hasAssertions();

        expect(Statement).toHaveLength(max);
    });

    it('exp: and or break if return', () => {
        expect.hasAssertions();

        const errList: TErrObj[] = [];
        for (const v of Statement) {
            const {
                keyRawName,
                body,
                exp,
            } = v;

            const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = !exp.join('\n').includes(keyRawName);
            const v5 = isAllowList(keyRawName);
            if (v3 || v4 || v5) {
                errList.push({
                    msg: '--15--36--49--76--56',
                    value: {
                        v3,
                        v4,
                        v,
                    },
                });
            }
        }

        expect(errList).toHaveLength(0);
    });

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const arr1: readonly string[] = Statement
            .map((v): string => v.keyRawName);

        const st1: string[] = (repository.flow_of_control.patterns.at(-1)?.match ?? '')
            .replace('\\b(?!MsgBox)(?<![.#])(?i:', '')
            .replace(')\\b(?!\\()', '')
            .split('|');
        st1.push('Continue');
        st1.sort();

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        expect(arr1).toStrictEqual([...arr1].sort());
        expect(arr1).toStrictEqual(st1);
    });

    it('check : uri', () => {
        expect.hasAssertions();

        type TSpecialUri = [
            string,
            typeof Statement[number]['link'],
        ];
        const specialUriList: TSpecialUri[] = [];
        for (const v of Statement) {
            const { link, keyRawName } = v;

            const tag = link
                .replace('https://www.autohotkey.com/docs/v1/lib/', '')
                .replace('.htm', '');
            if (tag !== keyRawName) {
                specialUriList.push([keyRawName, link]);
            }
        }

        expect(specialUriList).toStrictEqual(
            [
                ['Case', 'https://www.autohotkey.com/docs/v1/lib/Switch.htm'],
                ['Default', 'https://www.autohotkey.com/docs/v1/lib/Switch.htm'],
                ['If', 'https://www.autohotkey.com/docs/v1/lib/IfExpression.htm'],
                // If / IfEqual / IfNotEqual / IfLess / IfLessOrEqual / IfGreater / IfGreaterOrEqual
                ['IfGreater', 'https://www.autohotkey.com/docs/v1/lib/IfEqual.htm'],
                ['IfGreaterOrEqual', 'https://www.autohotkey.com/docs/v1/lib/IfEqual.htm'],
                ['IfLess', 'https://www.autohotkey.com/docs/v1/lib/IfEqual.htm'],
                ['IfLessOrEqual', 'https://www.autohotkey.com/docs/v1/lib/IfEqual.htm'],
                ['IfNotEqual', 'https://www.autohotkey.com/docs/v1/lib/IfEqual.htm'],
                // IfExist / IfNotExist
                ['IfNotExist', 'https://www.autohotkey.com/docs/v1/lib/IfExist.htm'],
                // IfInString / IfNotInString
                ['IfNotInString', 'https://www.autohotkey.com/docs/v1/lib/IfInString.htm'],
                // IfWinActive / IfWinNotActive
                ['IfWinNotActive', 'https://www.autohotkey.com/docs/v1/lib/IfWinActive.htm'],
                // IfWinExist / IfWinNotExist
                ['IfWinNotExist', 'https://www.autohotkey.com/docs/v1/lib/IfWinExist.htm'],
            ],
        );
    });

    it('check : diag', () => {
        expect.hasAssertions();

        const snapshot_ts: TDiagSnapshot[] = checkDiag([...Statement]);
        const snapshot_en: TDiagSnapshot[] = checkDiag(foc_en.body as TStatementElement[]);
        const snapshot_cn: TDiagSnapshot[] = checkDiag(foc_cn.body as TStatementElement[]);

        const snapshot_old: TDiagSnapshot[] = [
            ['IfEqual', 806],
            ['IfExist', 827],
            ['IfGreater', 806],
            ['IfGreaterOrEqual', 806],
            ['IfInString', 828],
            ['IfLess', 806],
            ['IfLessOrEqual', 806],
            ['IfNotEqual', 806],
            ['IfNotExist', 827],
            ['IfNotInString', 828],
            ['IfWinActive', 829],
            ['IfWinExist', 826],
            ['IfWinNotActive', 829],
            ['IfWinNotExist', 826],
        ];

        expect(snapshot_ts).toStrictEqual(snapshot_old);
        expect(snapshot_en).toStrictEqual(snapshot_old);
        expect(snapshot_cn).toStrictEqual(snapshot_old);
    });
});

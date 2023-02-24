import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { Statement } from './statement.data';

/**
 * Capitalize<Lowercase<str>>;
 */
function CapitalizeLowercase(str: string): string {
    return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}

function isAllowList(keyRawName: string, upName: string): boolean {
    if (keyRawName.startsWith('If')) return false;
    if (
        [
            'ExitApp',
            'GoSub',
        ].includes(keyRawName)
    ) {
        return false;
    }
    return keyRawName !== CapitalizeLowercase(upName);
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
                upName,
            } = v;

            const v1 = upName.toUpperCase() !== upName;
            const v2 = keyRawName.toUpperCase() !== upName;
            const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = !exp.join('\n').includes(keyRawName);
            const v5 = isAllowList(keyRawName, upName);
            if (v1 || v2 || v3 || v4 || v5) {
                errList.push({
                    msg: '--15--36--49--76--56',
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

        const arr1: readonly string[] = Statement.map((v): string => v.keyRawName);

        const st1: string = (repository.flow_of_control.patterns.at(-1)?.match ?? '')
            .replace('\\b(?!MsgBox)(?<![.#])(?i:', '')
            .replace(')\\b(?!\\()', '');

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        expect(arr1).toStrictEqual([...arr1].sort());
        expect(st1).toBe(arr1.join('|'));
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
                // GoSub -> Gosub
                ['GoSub', 'https://www.autohotkey.com/docs/v1/lib/Gosub.htm'],
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
});

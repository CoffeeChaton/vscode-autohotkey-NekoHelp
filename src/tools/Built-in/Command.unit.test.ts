import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { EDiagCode } from '../../diag';
import type { TCommandElement } from './Command.data';
import { LineCommand } from './Command.data';

type TErrObj = {
    msg: string,
    value: unknown,
};

describe('check LineCommand ruler', () => {
    const max = 178;

    it(`check: Command size .EQ. ${max}`, () => {
        expect.hasAssertions();

        expect(LineCommand).toHaveLength(max);
    });

    it('check: name ruler', () => {
        expect.hasAssertions();

        const errList: TErrObj[] = [];
        for (const v of LineCommand) {
            const {
                keyRawName,
                body,
                exp,
                diag,
                recommended,
                upName,
            } = v;
            const v1 = upName.toUpperCase() !== upName;
            const v2 = keyRawName.toUpperCase() !== upName;
            const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = !exp.join('\n').includes(keyRawName);
            const v5 = diag !== undefined && recommended;
            if (v1 || v2 || v3 || v4 || v5) {
                errList.push({
                    msg: '--86--32--51--78--64',
                    value: {
                        v1,
                        v2,
                        v3,
                        v4,
                        v5,
                        upName,
                        v,
                    },
                });
            }
        }

        expect(errList).toHaveLength(0);
    });

    it('check EDiagCode.OtherCommandErr', (): void => {
        expect.hasAssertions();

        type TCommandErr = {
            reg: RegExp,
            code: EDiagCode,
        };
        const headMatch: TCommandErr[] = [
            {
                reg: /^EnvDiv$/iu,
                code: EDiagCode.code803,
            },
            {
                reg: /^EnvMult$/iu,
                code: EDiagCode.code804,
            },
            {
                reg: /^If(?:Equal|NotEqual|Less|LessOrEqual|Greater|GreaterOrEqual)$/iu,
                code: EDiagCode.code806,
            },
            {
                reg: /^SplashImage|Progress$/iu,
                code: EDiagCode.code813,
            },
            {
                reg: /^SetEnv$/iu,
                code: EDiagCode.code814,
            },
            {
                reg: /^SetFormat$/iu,
                code: EDiagCode.code815,
            },
            {
                reg: /^SplashText(?:On|Off)$/iu,
                code: EDiagCode.code816,
            },
            {
                reg: /^Transform$/iu,
                code: EDiagCode.code824,
            },
            {
                reg: /^OnExit$/iu,
                code: EDiagCode.code812,
            },
            // Reg,,,... i need to Count colon  ??
            // New: RegRead, OutputVar, KeyName , ValueName
            // Old: RegRead, OutputVar, RootKey, SubKey , ValueName
        ];

        const errList: TErrObj[] = [];
        for (const v of LineCommand) {
            const { diag, keyRawName } = v;

            const find: TCommandErr | undefined = headMatch
                .find((element: TCommandErr): boolean => element.reg.test(keyRawName));

            if (find === undefined) continue; // miss

            const { code } = find;

            if ((diag === undefined || diag !== code)) {
                errList.push({ msg: '--86--39--126', value: { keyRawName, find } });
            }
        }

        expect(errList).toHaveLength(0);
    });

    it('check: command param naming rules', () => {
        expect.hasAssertions();

        const errList2: string[] = [];
        const errList3: string[] = [];
        const errList4: string[] = [];
        const errList5: string[] = [];
        for (const v of LineCommand) {
            const { body, keyRawName, _paramType } = v;
            const def: string[] = _paramType;

            // check grammar like ${1:out} or ${2|Option1,Option2|} // https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax
            const maList: RegExpMatchArray[] = [...body.matchAll(/\$\{\d+[|:]([^}]+)\}/gu)];
            if (maList.length !== def.length) {
                errList2.push(keyRawName);
                continue;
            }

            for (const [i, str] of [...def].entries()) {
                const st2: string = maList[i][1];
                if (str === 'O' && !st2.startsWith('Out')) {
                    errList3.push(keyRawName);
                }
            }

            for (const ma of maList) {
                // ma[0]: '${1|On,Off|}'
                // ma[1]: 'On,Off|'
                // check like grammar like ${2|Option1,Option2|}
                if (ma[0].includes('|')) {
                    const tempMa: RegExpMatchArray | null = ma[1].match(/^[\w,()-]+\|$/u);
                    if (tempMa === null && keyRawName !== 'SoundGet') { // N/A
                        errList4.push(`${keyRawName} => ${ma[1]}`);
                    }
                } else if (!(/^[.\w #:\\-]+$/u).test(ma[1])) {
                    errList5.push(`${keyRawName} => ${ma[1]}`);
                }
            }
        }

        expect(errList2).toStrictEqual([]);
        expect(errList3).toStrictEqual([]);
        expect(errList4).toStrictEqual([]);
        expect(errList5).toStrictEqual([]);
    });

    it('check: tmLanguage', () => {
        expect.hasAssertions();

        const tsData: readonly string[] = LineCommand
            .map((v): string => v.keyRawName);

        const st1: string = (repository.command.patterns.at(-1)?.begin ?? '')
            .replace('(?:^|[ \\t:])\\b(?i:', '')
            .replace(')\\b(?!\\()', '');

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        expect(tsData).toStrictEqual([...tsData].sort());
        expect(tsData.join('|')).toBe(st1);
    });

    it('check: uri ruler', () => {
        expect.hasAssertions();

        type TSpecialUri = [
            string,
            TCommandElement['link'],
        ];
        const specialUriList: TSpecialUri[] = [];
        for (const v of LineCommand) {
            const { link, keyRawName } = v;

            const tag = link
                .replace('https://www.autohotkey.com/docs/v1/lib/', '')
                .replace('.htm', '')
                .replace('#command', '');
            if (tag !== keyRawName) {
                specialUriList.push([keyRawName, link]);
            }
        }

        expect(specialUriList).toStrictEqual([
            // ControlSend[Raw]
            ['ControlSendRaw', 'https://www.autohotkey.com/docs/v1/lib/ControlSend.htm'],
            // Run / RunWait
            ['RunWait', 'https://www.autohotkey.com/docs/v1/lib/Run.htm'],
            // Send, SendRaw, SendInput, SendPlay, SendEvent
            ['SendEvent', 'https://www.autohotkey.com/docs/v1/lib/Send.htm'],
            ['SendInput', 'https://www.autohotkey.com/docs/v1/lib/Send.htm'],
            ['SendMessage', 'https://www.autohotkey.com/docs/v1/lib/PostMessage.htm'],
            ['SendPlay', 'https://www.autohotkey.com/docs/v1/lib/Send.htm'],
            ['SendRaw', 'https://www.autohotkey.com/docs/v1/lib/Send.htm'],
            // SetCapsLockState / SetNumLockState / SetScrollLockState
            ['SetCapsLockState', 'https://www.autohotkey.com/docs/v1/lib/SetNumScrollCapsLockState.htm'],
            ['SetNumLockState', 'https://www.autohotkey.com/docs/v1/lib/SetNumScrollCapsLockState.htm'],
            ['SetScrollLockState', 'https://www.autohotkey.com/docs/v1/lib/SetNumScrollCapsLockState.htm'],
            // FIXME SetStoreCapsLockMode  -> Lock -> lock
            ['SetStoreCapsLockMode', 'https://www.autohotkey.com/docs/v1/lib/SetStoreCapslockMode.htm'],
            // Progress / SplashImage
            ['SplashImage', 'https://www.autohotkey.com/docs/v1/lib/Progress.htm'],
            // SplashTextOn / SplashTextOff
            ['SplashTextOff', 'https://www.autohotkey.com/docs/v1/lib/SplashTextOn.htm'],
            // StringLeft / StringRight
            ['StringRight', 'https://www.autohotkey.com/docs/v1/lib/StringLeft.htm'],
            ['StringTrimRight', 'https://www.autohotkey.com/docs/v1/lib/StringTrimLeft.htm'],
            // StringLower / StringUpper
            ['StringUpper', 'https://www.autohotkey.com/docs/v1/lib/StringLower.htm'],
            // url -> URL
            ['UrlDownloadToFile', 'https://www.autohotkey.com/docs/v1/lib/URLDownloadToFile.htm'],
            // WinMinimizeAll / WinMinimizeAllUndo
            ['WinMinimizeAllUndo', 'https://www.autohotkey.com/docs/v1/lib/WinMinimizeAll.htm'],
            // WinWaitActive / WinWaitNotActive
            ['WinWaitNotActive', 'https://www.autohotkey.com/docs/v1/lib/WinWaitActive.htm'],
        ]);
    });
});

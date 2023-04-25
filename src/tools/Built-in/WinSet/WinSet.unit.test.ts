/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable no-template-curly-in-string */
import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
// import type { TWinSetCmdElement } from './WinSet.data';
import { WinSetSubCmdList } from './WinSet.data';

describe('check WinSet subCmd ruler', () => {
    it('check : WinSet Data', () => {
        expect.hasAssertions();

        type TErrObj = {
            case: number,
            SubCommand: string,
            str: string,
        };

        const shortening: [string, string][] = [
            ['AlwaysOnTop', 'Makes a window stay on top of all other windows.'],
            ['Bottom', 'Sends a window to the bottom of stack; that is, beneath all other windows.'],
            ['Top', 'Brings a window to the top of the stack without explicitly activating it.'],
            ['Disable', 'Disables a window.'],
            ['Enable', 'Enables a window.'],
            ['Redraw', 'Redraws a window.'],
            ['Style', 'Changes the style of a window.'],
            ['ExStyle', 'Changes the extended style of a window.'],
            ['Region', 'Changes the shape of a window to be the specified rectangle, ellipse, or polygon.'],
            ['Transparent', 'Makes a window semi-transparent.'],
            ['TransColor', 'Makes all pixels of the chosen color invisible inside the target window.'],
        ];

        const errList: TErrObj[] = [];
        for (const [i, v] of WinSetSubCmdList.entries()) {
            const {
                body,
                doc,
                exp,
                link,
                SubCommand,
            } = v;

            if (!body.startsWith(`WinSet, ${SubCommand}`)) {
                errList.push({ case: 1, SubCommand, str: body });
            }
            if (!body.includes(SubCommand)) {
                errList.push({ case: 2, SubCommand, str: body });
            }
            if (!link.endsWith(`#${SubCommand}`)) errList.push({ case: 3, SubCommand, str: link });
            if (!exp[0].startsWith(`WinSet, ${SubCommand}`)) {
                errList.push({ case: 4, SubCommand, str: exp[0] });
            }

            const [cmd, miniDoc] = shortening[i];
            if (SubCommand !== cmd) {
                errList.push({ case: 5, SubCommand, str: cmd });
            }

            if (doc !== miniDoc) {
                errList.push({ case: 6, SubCommand, str: 'doc' });
            }
        }

        expect(WinSetSubCmdList).toHaveLength(shortening.length);
        expect(errList).toStrictEqual([{
            SubCommand: 'Top',
            case: 6,
            str: 'doc', // has uri
        }, {
            SubCommand: 'Transparent',
            case: 6,
            str: 'doc', // add 0-255, 0 makes the window invisible while 255 makes it opaque.
        }]);
    });

    it('check : tmLanguage name end with .winSet.ahk', () => {
        expect.hasAssertions();

        type TErrObj = {
            msg: string,
            value: unknown,
        };

        const errList0: TErrObj[] = [];
        JSON.stringify(repository.command_winset, (key: string, value: unknown): unknown => {
            if (key !== 'name') return value;

            if (typeof value !== 'string') {
                errList0.push({ msg: 'value not string', value });
                return value;
            }

            if (!value.endsWith('.winSet.ahk'.toLowerCase())) {
                errList0.push({ msg: 'name not endsWith .winSet.ahk', value });
            }

            return value;
        });

        expect(errList0).toHaveLength(0);
    });

    it('check : tmLanguage ruler', () => {
        expect.hasAssertions();

        const tmArr: string[] = repository.command_winset.begin
            .replace(
                '(?:^|[ \\t:])\\b(?i:(WinSet)\\b[ \\t]*,?[ \\t]*\\b(',
                '',
            )
            .replace(')\\b)', '')
            .split('|');

        const TsArr: string[] = WinSetSubCmdList
            .map((v): string => v.SubCommand);

        expect(tmArr).toStrictEqual(TsArr);
    });
});

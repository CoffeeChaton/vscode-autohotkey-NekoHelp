/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable no-template-curly-in-string */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { repository } from '../../../../../syntaxes/ahk.tmLanguage.json';
import { WinGetSubCmdList } from './WinGet.data';

describe('check WinGet subCmd ruler', () => {
    it('check : WinGet Data', () => {
        expect.hasAssertions();

        type TErrObj = {
            case: number,
            SubCommand: string,
            str: string,
        };

        const shortening: string[] = [
            'ID: Retrieves the unique ID number of a window.',
            'IDLast: Retrieves the unique ID number of the last/bottommost window if there is more than one match.',
            'PID: Retrieves the Process ID number of a window.',
            'ProcessName: Retrieves the name of the process that owns a window.',
            'ProcessPath: Retrieves the full path and name of the process that owns a window.',
            'Count: Retrieves the number of existing windows that match the title/text parameters.',
            'List: Retrieves the unique ID numbers of all existing windows that match the title/text parameters.',
            'MinMax: Retrieves the minimized/maximized state for a window.',
            'ControlList: Retrieves the control name for each control in a window.',
            'ControlListHwnd: Retrieves the unique ID number for each control in a window.',
            'Transparent: Retrieves the degree of transparency of a window.',
            'TransColor: Retrieves the color that is marked transparent in a window.',
            'Style: Retrieves an 8-digit hexadecimal number representing the style of a window.',
            'ExStyle: Retrieves an 8-digit hexadecimal number representing the extended style of a window.',
        ];

        const expList: string[] = [''];
        const errList: TErrObj[] = [];
        for (const [i, v] of WinGetSubCmdList.entries()) {
            const {
                body,
                doc,
                exp,
                link,
                SubCommand,
            } = v;

            if (
                body
                    !== `WinGet, \${1:OutputVar}, [${SubCommand}, \${2:WinTitle}, \${3:WinText}, \${4:ExcludeTitle}, \${5:ExcludeText}]`
            ) {
                errList.push({ case: 1, SubCommand, str: body });
            }
            if (!body.includes(SubCommand)) {
                errList.push({ case: 2, SubCommand, str: body });
            }
            if (!link.endsWith(`#${SubCommand}`)) errList.push({ case: 3, SubCommand, str: link });
            if (exp[0] !== `WinGet, OutputVar [, ${SubCommand}, WinTitle, WinText, ExcludeTitle, ExcludeText]`) {
                errList.push({ case: 4, SubCommand, str: exp[0] });
            }

            const [cmd, miniDoc] = shortening[i].split(':') as [string, string];
            if (SubCommand !== cmd) {
                errList.push({ case: 5, SubCommand, str: cmd });
            }

            if (doc !== miniDoc) {
                errList.push({ case: 6, SubCommand, str: 'doc' });
            }

            expList.push(
                `; ${SubCommand}`,
                exp[0]
                    .replace('[', '')
                    .replace(']', ''),
            );
            if (exp.length > 1) {
                for (let j = 1; j < exp.length; j++) {
                    expList.push(
                        exp[j],
                    );
                }
            }
            expList.push('');
        }

        const absolutePath: string = path.join(__dirname, '../../../../../syntaxes/grammar/WinGet.ahk');
        const expAhkList: string[] = fs.readFileSync(absolutePath, { encoding: 'utf8' }).split(/\r?\n/u);

        expect(WinGetSubCmdList).toHaveLength(shortening.length);
        expect(errList).toStrictEqual([
            {
                SubCommand: 'PID',
                case: 6, // MD-uri
                str: 'doc',
            },
            {
                SubCommand: 'Transparent',
                case: 6, // MD ex
                str: 'doc',
            },
        ]);

        expect(expList).toStrictEqual(expAhkList);
    });

    it('check : tmLanguage name end with .winGet.ahk', () => {
        expect.hasAssertions();

        type TErrObj = {
            msg: string,
            value: unknown,
        };

        const errList0: TErrObj[] = [];
        JSON.stringify(repository.command_winget, (key: string, value: unknown): unknown => {
            if (key !== 'name') return value;

            if (typeof value !== 'string') {
                errList0.push({ msg: 'value not string', value });
                return value;
            }

            if (!value.endsWith('.winGet.ahk'.toLowerCase())) {
                errList0.push({ msg: 'name not endsWith .winGet.ahk', value });
            }

            return value;
        });

        expect(errList0).toHaveLength(0);
    });

    it('check : tmLanguage ruler', () => {
        expect.hasAssertions();

        const tmArr: string[] = repository.command_winget.begin
            .replace(
                '(?:^|[ \\t:])\\b(?i:(WinGet)\\b[ \\t]*,?[ \\t]*(?:[#$@\\w\\x{A1}-\\x{FFFF}]+)[ \\t]*,?[ \\t]*\\b(',
                '',
            )
            .replace(')\\b)', '')
            .split('|');

        const TsArr: string[] = WinGetSubCmdList
            .map((v): string => v.SubCommand);

        expect(tmArr).toStrictEqual(TsArr);
    });
});

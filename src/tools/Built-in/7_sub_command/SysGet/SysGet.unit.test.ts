/* eslint-disable no-template-curly-in-string */
import { describe, expect, it } from '@jest/globals';
import { repository } from '../../../../../syntaxes/ahk.tmLanguage.json';
import type { TSysGetCmdElement } from './SysGet.data';
import { SysGetSubCmdList } from './SysGet.data';

describe('check SysGet subCmd ruler', () => {
    it('check : SysGet Data', () => {
        expect.hasAssertions();

        type TErrObj = {
            case: number,
            SubCommand: string,
            str: string,
        };

        const errList: TErrObj[] = [];
        for (const v of SysGetSubCmdList) {
            const {
                body,
                SubCommand,
                exp,
                link,
            } = v;

            if (!body.startsWith(`SysGet, \${1:OutputVar}, ${SubCommand}`)) {
                errList.push({ case: 1, SubCommand, str: body });
            }
            if (!body.includes(SubCommand)) {
                errList.push({ case: 2, SubCommand, str: body });
            }
            if (!link.endsWith(`#${SubCommand}`)) errList.push({ case: 3, SubCommand, str: link });
            if (!exp[0].startsWith(`SysGet, OutputVar, ${SubCommand}`)) {
                errList.push({ case: 4, SubCommand, str: exp[0] });
            }
            // if (!doc.toLowerCase().includes(SubCommand.toLowerCase())) {
            //     errList.push({ case: 5, SubCommand, str: 'just doc' });
            // }
        }

        const max = 6;

        expect(SysGetSubCmdList).toHaveLength(max);
        expect(errList).toStrictEqual([
            {
                SubCommand: '(Numeric)',
                case: 1,
                str: 'SysGet, ${1:OutputVar}, ${2:N}',
            },
            {
                SubCommand: '(Numeric)',
                case: 2,
                str: 'SysGet, ${1:OutputVar}, ${2:N}',
            },
            {
                SubCommand: '(Numeric)',
                case: 3,
                str: 'https://www.autohotkey.com/docs/v1/lib/SysGet.htm#Numeric',
            },
            {
                SubCommand: '(Numeric)',
                case: 4,
                str: 'SysGet, OutputVar, N',
            },
        ]);
    });

    it('check : tmLanguage name end with .sysget.ahk', () => {
        expect.hasAssertions();

        type TErrObj = {
            msg: string,
            value: unknown,
        };

        const errList0: TErrObj[] = [];
        JSON.stringify(repository.command_sysget, (key: string, value: unknown): unknown => {
            if (key !== 'name') return value;

            if (typeof value !== 'string') {
                errList0.push({ msg: 'value not string', value });
                return value;
            }

            if (!value.endsWith('.sysget.ahk')) {
                errList0.push({ msg: 'name not endsWith .sysget.ahk', value });
            }

            return value;
        });

        expect(errList0).toHaveLength(0);
    });

    it('check : tmLanguage ruler', () => {
        expect.hasAssertions();

        const tmArr: string[] = repository.command_sysget.begin
            .replace(
                '(?:^|[ \\t:])\\b(?i:(SysGet)\\b[ \\t]*,?[ \\t]*(?:[#$@\\w\\x{A1}-\\x{FFFF}]+)[ \\t]*,[ \\t]*\\b(',
                '',
            )
            .replace(')\\b)', '')
            .split('|');

        const TsArr: string[] = SysGetSubCmdList
            .filter(({ SubCommand }: TSysGetCmdElement): boolean => !SubCommand.includes('('))
            .map(({ SubCommand }: TSysGetCmdElement): string => SubCommand);

        expect(tmArr).toStrictEqual(TsArr);
    });
});

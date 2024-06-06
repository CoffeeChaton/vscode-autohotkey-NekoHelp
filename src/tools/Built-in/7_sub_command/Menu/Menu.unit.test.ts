import { describe, expect, it } from '@jest/globals';
import { repository } from '../../../../../syntaxes/ahk.tmLanguage.json';
import { MenuSubCmdList } from './Menu.data';

describe('check Menu subCmd ruler', () => {
    const max = 24;

    it('check : body start with Menu', () => {
        expect.hasAssertions();

        type TErrObj = {
            case: number,
            SubCommand: string,
        };

        const errList: TErrObj[] = [];
        for (const v of MenuSubCmdList) {
            const {
                body,
                SubCommand,
                exp,
                link,
            } = v;

            if (!body.startsWith('Menu, ')) errList.push({ case: 1, SubCommand });
            if (!body.includes(SubCommand)) errList.push({ case: 2, SubCommand });
            if (!link.endsWith(`#${SubCommand}`)) errList.push({ case: 3, SubCommand });
            if (!exp[0].includes(SubCommand)) errList.push({ case: 4, SubCommand });
        }

        expect(MenuSubCmdList).toHaveLength(max);
        expect(errList).toStrictEqual([]);
    });

    it('check : doc', () => {
        expect.hasAssertions();

        const errList: string[] = [];
        for (const { SubCommand, doc } of MenuSubCmdList) {
            if (!doc.toLowerCase().includes(SubCommand.toLowerCase())) errList.push(SubCommand);
        }

        expect(errList).toStrictEqual([
            //
            'DeleteAll',
            'Uncheck',
            'ToggleCheck',
            'Enable',
            'Disable',
            'ToggleEnable',
            'NoDefault',
            'NoStandard',
            'NoIcon',
            'Show',
            'MainWindow',
            'NoMainWindow',
            'UseErrorLevel',
        ]);
    });

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const arr1: string[] = MenuSubCmdList
            .map((v): string => v.SubCommand.replace('#', ''));

        const st1 = repository.command_menu.begin
            .replace(
                '(?:^|[ \\t:])\\b(?i:(menu)\\b[ \\t]*(?:,[ \\t]*)?([#$@\\w\\x{A1}-\\x{FFFF}]+)[ \\t]*,[ \\t]*(',
                '',
            )
            .replace(')\\b)', '')
            .split('|');

        expect(st1).toStrictEqual(arr1);
    });
});

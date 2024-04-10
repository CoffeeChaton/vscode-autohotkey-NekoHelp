/* eslint-disable no-template-curly-in-string */
import { describe, expect, it } from '@jest/globals';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { repository } from '../../../../../syntaxes/ahk.tmLanguage.json';
import { ControlSubCmdList } from './Control.data';

describe('check Control subCmd ruler', () => {
    it('check : Control Data', () => {
        expect.hasAssertions();

        type TErrObj = {
            case: number,
            SubCommand: string,
            str: string,
        };

        const shortening: string[] = [
            'Check: Turns on (checks) a radio button or checkbox.',
            'Uncheck: Turns off a radio button or checkbox.',
            'Enable: Enables a control if it was previously disabled.',
            'Disable: Disables or "grays out" a control.',
            'Show: Shows a control if it was previously hidden.',
            'Hide: Hides a control.',
            'Style: Changes the style of a control.',
            'ExStyle: Changes the extended style of a control.',
            'ShowDropDown: Shows the drop-down list of a ComboBox control.',
            'HideDropDown: Hides the drop-down list of a ComboBox control.',
            'TabLeft: Moves left by one or more tabs in a SysTabControl32.',
            'TabRight: Moves right by one or more tabs in a SysTabControl32.',
            'Add: Adds the specified string as a new entry at the bottom of a ListBox, ComboBox (and possibly other types).',
            'Delete: Deletes the specified entry number from a ListBox or ComboBox.',
            'Choose: Sets the selection in a ListBox or ComboBox to be the specified entry number.',
            'ChooseString: Sets the selection in a ListBox or ComboBox to be the first entry whose leading part matches the specified string.',
            'EditPaste: Pastes the specified string at the caret in an Edit control.',
        ];

        const expList: string[] = [''];
        const errList: TErrObj[] = [];
        for (const [i, v] of ControlSubCmdList.entries()) {
            const {
                body,
                doc,
                exp,
                link,
                SubCommand,
            } = v;

            if (!body.startsWith(`Control, ${SubCommand} `)) {
                errList.push({ case: 1, SubCommand, str: body });
            }
            if (!body.includes(SubCommand)) {
                errList.push({ case: 2, SubCommand, str: body });
            }
            if (!link.endsWith(`#${SubCommand}`)) errList.push({ case: 3, SubCommand, str: link });
            if (!exp[0].startsWith(`Control, ${SubCommand} `)) {
                errList.push({ case: 4, SubCommand, str: exp[0] });
            }

            if (
                exp[0] !== body
                    .replaceAll(/\$\{\d:/gu, '')
                    .replaceAll('}', '')
            ) {
                errList.push({ case: 7, SubCommand, str: exp[0] });
            }

            if (!body.endsWith(', ${2:Control}, ${3:WinTitle}, ${4:WinText}, ${5:ExcludeTitle}, ${6:ExcludeText}]')) {
                errList.push({ case: 8, SubCommand, str: body });
            }

            if (!exp[0].endsWith(', Control, WinTitle, WinText, ExcludeTitle, ExcludeText]')) {
                errList.push({ case: 9, SubCommand, str: exp[0] });
            }

            // ----------shortening{
            const [cmd, miniDoc] = shortening[i].split(':') as [string, string];
            if (SubCommand !== cmd) {
                errList.push({ case: 5, SubCommand, str: cmd });
            }

            if (doc !== miniDoc) {
                errList.push({ case: 6, SubCommand, str: 'doc' });
            }
            // ----------shortening}

            //
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

        const absolutePath: string = path.join(__dirname, '../../../../../syntaxes/grammar/Control.ahk');
        const expAhkList: string[] = fs.readFileSync(absolutePath, { encoding: 'utf8' }).split(/\r?\n/u);

        expect(expList).toStrictEqual(expAhkList);
        expect(errList).toStrictEqual([]);
        expect(ControlSubCmdList).toHaveLength(shortening.length);
    });

    it('check : tmLanguage name end with .control.ahk', () => {
        expect.hasAssertions();

        type TErrObj = {
            msg: string,
            value: unknown,
        };

        const errList0: TErrObj[] = [];
        JSON.stringify(repository.command_control, (key: string, value: unknown): unknown => {
            if (key !== 'name') return value;

            if (typeof value !== 'string') {
                errList0.push({ msg: 'value not string', value });
                return value;
            }

            if (!value.endsWith('.control.ahk'.toLowerCase())) {
                errList0.push({ msg: 'name not endsWith .control.ahk', value });
            }

            return value;
        });

        expect(errList0).toHaveLength(0);
    });

    it('check : tmLanguage ruler', () => {
        expect.hasAssertions();

        const tmArr: string[] = repository.command_control.begin
            .replace(
                '(?:^|[ \\t:])\\b(?i:(Control)\\b[ \\t]*,?[ \\t]*\\b(',
                '',
            )
            .replace(')\\b)', '')
            .split('|');

        const TsArr: string[] = ControlSubCmdList
            .map((v): string => v.SubCommand);

        expect(tmArr).toStrictEqual(TsArr);
    });
});

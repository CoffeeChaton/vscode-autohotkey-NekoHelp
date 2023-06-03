/* eslint-disable no-template-curly-in-string */
import { repository } from '../../../../../syntaxes/ahk.tmLanguage.json';
import { ControlGetSubCmdList } from './ControlGet.data';

describe('check ControlGet subCmd ruler', () => {
    it('check : ControlGet Data', () => {
        expect.hasAssertions();

        type TErrObj = {
            case: number,
            SubCommand: string,
            str: string,
        };

        const shortening: string[] = [
            'List: Retrieves a list of items from a ListView, ListBox, ComboBox, or DropDownList.',
            'Checked: Retrieves 1 if the checkbox or radio button is checked or 0 if not.',
            'Enabled: Retrieves 1 if the control is enabled, or 0 if disabled.',
            'Visible: Retrieves 1 if the control is visible, or 0 if hidden.',
            'Tab: Retrieves the tab number of a SysTabControl32 control.',
            'FindString: Retrieves the entry number of a ListBox or ComboBox that is an exact match for the string.',
            'Choice: Retrieves the name of the currently selected entry in a ListBox or ComboBox.',
            'LineCount: Retrieves the number of lines in an Edit control.',
            'CurrentLine: Retrieves the line number in an Edit control where the caret resides.',
            'CurrentCol: Retrieves the column number in an Edit control where the caret resides.',
            'Line: Retrieves the text of the specified line number in an Edit control.',
            'Selected: Retrieves the selected text in an Edit control.',
            'Style: Retrieves an 8-digit hexadecimal number representing the style of the control.',
            'ExStyle: Retrieves an 8-digit hexadecimal number representing the extended style of the control.',
            'Hwnd: Retrieves the window handle (HWND) of the control.',
        ];

        const errList: TErrObj[] = [];
        for (const [i, v] of ControlGetSubCmdList.entries()) {
            const {
                body,
                doc,
                exp,
                link,
                SubCommand,
            } = v;

            if (
                body
                    !== `ControlGet, \${1:OutputVar}, ${SubCommand} [, \${2:Value}, \${3:Control}, \${4:WinTitle}, \${5:WinText}, \${6:ExcludeTitle}, \${7:ExcludeText}]`
            ) {
                // ControlGet, OutputVar, SubCommand [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]
                errList.push({ case: 1, SubCommand, str: body });
            }

            if (!link.endsWith(`#${SubCommand}`)) errList.push({ case: 3, SubCommand, str: link });

            if (
                exp[0]
                    !== `ControlGet, OutputVar, ${SubCommand} [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]`
            ) {
                // // ControlGet, OutputVar, SubCommand [, Value, Control, WinTitle, WinText, ExcludeTitle, ExcludeText]
                errList.push({ case: 7, SubCommand, str: exp[0] });
            }

            // ----------shortening{
            const [cmd, miniDoc] = shortening[i].split(':') as [string, string];
            if (SubCommand !== cmd) {
                errList.push({ case: 5, SubCommand, str: cmd });
            }

            if (doc.trim() !== miniDoc.trim()) {
                errList.push({ case: 6, SubCommand, str: 'doc' });
            }
        }

        expect(errList).toStrictEqual([]);
        expect(ControlGetSubCmdList).toHaveLength(shortening.length);
    });

    it('check : tmLanguage name end with .ControlGet.ahk', () => {
        expect.hasAssertions();

        type TErrObj = {
            msg: string,
            value: unknown,
        };

        const errList0: TErrObj[] = [];
        JSON.stringify(repository.command_controlget, (key: string, value: unknown): unknown => {
            if (key !== 'name') return value;

            if (typeof value !== 'string') {
                errList0.push({ msg: 'value not string', value });
                return value;
            }

            if (!value.endsWith('.ControlGet.ahk'.toLowerCase())) {
                errList0.push({ msg: 'name not endsWith .ControlGet.ahk', value });
            }

            return value;
        });

        expect(errList0).toHaveLength(0);

        expect([]).toStrictEqual([]);
    });

    it('check : tmLanguage ruler', () => {
        expect.hasAssertions();

        const tmArr: string[] = repository.command_controlget.begin
            .replace(
                '(?:^|[ \\t:])\\b(?i:(ControlGet)\\b[ \\t]*,?[ \\t]*(?:[#$@\\w\\x{A1}-\\x{FFFF}]+)[ \\t]*,[ \\t]*(',
                '',
            )
            .replace(')\\b)', '')
            .split('|');

        const TsArr: string[] = ControlGetSubCmdList
            .map((v): string => v.SubCommand);

        expect(tmArr).toStrictEqual(TsArr);

        expect([]).toStrictEqual([]);
    });
});

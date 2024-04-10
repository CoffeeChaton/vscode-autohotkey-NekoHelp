import { describe, expect, it } from '@jest/globals';
import { repository } from '../../../syntaxes/ahk.tmLanguage.json';

describe('check Hotkey ruler', () => {
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        type TErrObj = {
            msg: string,
            value: unknown,
        };

        const errList0: TErrObj[] = [];
        JSON.stringify(repository.command_hotkey.patterns, (key: string, value: unknown): unknown => {
            if (key !== 'name') return value;

            if (typeof value !== 'string') {
                errList0.push({ msg: 'value not string', value });
                return value;
            }

            if (!(/^[a-z][a-z\d_.]+$/u).test(value)) {
                errList0.push({ msg: 'name not match a-z_0-9', value });
            }

            if (!value.endsWith('.hotkey.command.ahk')) {
                errList0.push({ msg: 'name not end with .hotkey.command.ahk', value });
            }

            return value;
        });

        expect(errList0).toStrictEqual([]);
    });
});

// https://www.autohotkey.com/docs/v1/lib/Hotkey.htm

// IfWinActive
// IfWinExist
// IfWinNotActive
// IfWinNotExist
// If, Expression
// If, % FunctionObject

// OK Hotkey, KeyName , Label, Options
//                        ^
// NG Hotkey, IfWinActive/Exist , WinTitle, WinText
// NG Hotkey, If , Expression
// NG Hotkey, If, % FunctionObject

/* eslint-disable no-template-curly-in-string */
import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
import type { TGuiControlCmdElement } from './GuiControl.data';
import { GuiControlSubCmdList } from './GuiControl.data';

describe('check GuiControl subCmd ruler', () => {
    it('check : GuiControl Data', () => {
        expect.hasAssertions();

        type TErrObj = {
            case: number,
            SubCommand: string,
            str: string,
        };

        const errList: TErrObj[] = [];
        for (const v of GuiControlSubCmdList) {
            const {
                body,
                SubCommand,
                exp,
                link,
                doc,
            } = v;

            if (!body.startsWith(`GuiControl, ${SubCommand}`)) errList.push({ case: 1, SubCommand, str: body });
            if (!body.includes(SubCommand)) errList.push({ case: 2, SubCommand, str: body });
            if (!link.endsWith(`#${SubCommand}`)) errList.push({ case: 3, SubCommand, str: link });
            if (!exp[0].startsWith(`GuiControl, ${SubCommand}`)) errList.push({ case: 4, SubCommand, str: exp[0] });
            if (!doc.toLowerCase().includes(SubCommand.toLowerCase())) {
                errList.push({ case: 5, SubCommand, str: 'just doc' });
            }
        }

        const max = 13;

        expect(GuiControlSubCmdList).toHaveLength(max);
        expect(errList).toStrictEqual([
            //
            { case: 1, SubCommand: '(Blank)', str: 'GuiControl, , ${1:ControlID} [, ${2:Value}]' },
            { case: 2, SubCommand: '(Blank)', str: 'GuiControl, , ${1:ControlID} [, ${2:Value}]' },
            { case: 3, SubCommand: '(Blank)', str: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#Blank' },
            { case: 4, SubCommand: '(Blank)', str: 'GuiControl, , ControlID [, Value]' },
            { case: 5, SubCommand: '(Blank)', str: 'just doc' },
            //
            { case: 1, SubCommand: '(options)', str: 'GuiControl, +-Option1 , ${1:ControlID} [, ${2:Value}]' },
            { case: 2, SubCommand: '(options)', str: 'GuiControl, +-Option1 , ${1:ControlID} [, ${2:Value}]' },
            { case: 3, SubCommand: '(options)', str: 'https://www.autohotkey.com/docs/v1/lib/GuiControl.htm#options' },
            { case: 4, SubCommand: '(options)', str: 'GuiControl, +/-Option1 +/-Option2 ..., ControlID , Value' },
            { case: 5, SubCommand: '(options)', str: 'just doc' },
            //
            { case: 5, SubCommand: 'MoveDraw', str: 'just doc' },
            { case: 5, SubCommand: 'Choose', str: 'just doc' },
            { case: 5, SubCommand: 'ChooseString', str: 'just doc' },
        ]);
    });

    it('check : tmLanguage name has .gui_control.', () => {
        expect.hasAssertions();

        type TErrObj = {
            msg: string,
            value: unknown,
        };

        const errList0: TErrObj[] = [];
        JSON.stringify(repository.command_gui_control, (key: string, value: unknown): unknown => {
            if (key !== 'name') return value;

            if (typeof value !== 'string') {
                errList0.push({ msg: 'value not string', value });
                return value;
            }

            if (!value.includes('.gui_control.')) {
                errList0.push({ msg: 'name not match .gui_control. ', value });
            }

            return value;
        });

        expect(errList0).toHaveLength(0);
    });

    it('check : tmLanguage ruler', () => {
        expect.hasAssertions();

        const tmArr: string[] = repository.command_gui_control.begin
            .replace('(?:^|[ \\t:])\\b(?i:(GuiControl)\\b[ \\t]*,?[ \\t]*(\\w+:\\s*)?(\\b(?:', '')
            .replace(')\\b)?[ \\t]*),', '')
            .split('|');

        const TsArr: string[] = GuiControlSubCmdList
            .filter(({ SubCommand }: TGuiControlCmdElement): boolean => !SubCommand.includes('('))
            .map(({ SubCommand }: TGuiControlCmdElement): string => SubCommand);

        expect(tmArr).toStrictEqual(TsArr);
    });
});

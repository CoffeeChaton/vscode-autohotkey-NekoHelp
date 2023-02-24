import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
import { guiSubCommandList } from './gui.data';

describe('check gui subCmd ruler', () => {
    const max = 17;

    it('check : body start with gui', () => {
        expect.hasAssertions();

        type TErrObj = {
            case: number,
            SubCommand: string,
        };

        const errList: TErrObj[] = [];
        for (const v of guiSubCommandList) {
            const {
                body,
                SubCommand,
                exp,
                link,
            } = v;

            if (!body.startsWith('Gui, ')) errList.push({ case: 1, SubCommand });
            if (!body.includes(SubCommand)) errList.push({ case: 2, SubCommand });
            if (!link.endsWith(`#${SubCommand}`)) errList.push({ case: 3, SubCommand });
            if (!exp[0].startsWith(`Gui, ${SubCommand}`)) errList.push({ case: 4, SubCommand });
        }

        expect(guiSubCommandList).toHaveLength(max);
        expect(errList).toStrictEqual([
            { case: 4, SubCommand: 'Default' },
            { case: 2, SubCommand: 'Options' },
            { case: 4, SubCommand: 'Options' },
        ]);
    });

    it('check : tmLanguage name has .gui.', () => {
        expect.hasAssertions();

        type TErrObj = {
            msg: string,
            value: unknown,
        };

        const errList0: TErrObj[] = [];
        JSON.stringify(repository.command_gui, (key: string, value: unknown): unknown => {
            if (key !== 'name') return value;

            if (typeof value !== 'string') {
                errList0.push({ msg: 'value not string', value });
                return value;
            }

            if (!value.includes('.gui.')) {
                errList0.push({ msg: 'name not match .gui. ', value });
            }

            return value;
        });

        expect(errList0).toHaveLength(0);
    });
});

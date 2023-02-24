import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { statement2Data } from './statement2.data';

// TODO cover IfBetween
describe('check Statement2 ruler', () => {
    it('check : loop tmLanguage', () => {
        expect.hasAssertions();

        const str1: string = statement2Data
            .map((v): string => v.keyRawName)
            .filter((v: string): boolean => v.startsWith('Loop'))
            .map((v: string): string => v.replace('Loop', ''))
            .join('|');

        const str2: string = (repository.flow_of_control_loop_plus.match)
            .replace('\\b(?!MsgBox)(?<![.#])(?i:\\b(loop)\\b[ \\t]*?,?[ \\t]*(', '')
            .replace('))', '');

        expect(str1).toBe('Files|Parse|Read|Reg');
        expect(str1).toBe(str2);
    });
});

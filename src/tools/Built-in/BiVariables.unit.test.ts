import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { BiVariables } from './BiVariables.data';

describe('check BiVariables ruler', () => {
    const arr1: string[] = BiVariables
        .map((v): string => v.keyRawName);

    const max = 8;

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const st1: string = (repository.builtin_variable.patterns[1].match)
            .replace('(?<![.#])\\b(?i:', '')
            .replace(')\\b', '');

        expect(arr1).toHaveLength(max);
        expect(st1).toBe(arr1.join('|'));
    });
});

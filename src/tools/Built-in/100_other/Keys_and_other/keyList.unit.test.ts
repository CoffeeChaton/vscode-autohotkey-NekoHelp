/* eslint-disable @typescript-eslint/require-array-sort-compare */
import { repository } from '../../../../../syntaxes/ahk.tmLanguage.json';
import { keyList } from './keyList.data';

describe('check keyList ruler', (): void => {
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const st1: string[] = (repository.keylist.match)
            .replace('\\b(?i:', '')
            .replace('|vk[a-f\\d]{1,2}(sc[a-f\\d]+)?|sc[a-f\\d]+)\\b', '')
            .toLowerCase()
            .split('|')
            .sort();

        expect(st1).toStrictEqual(keyList.map((key: string): string => key.toLowerCase()).sort());
    });
});

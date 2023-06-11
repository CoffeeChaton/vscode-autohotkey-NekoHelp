/* eslint-disable @typescript-eslint/require-array-sort-compare */
import { repository } from '../../../../../syntaxes/ahk.tmLanguage.json';
import { keyList, keyListAltTab } from './keyList.data';

describe('check keyList ruler', (): void => {
    it('check : tmLanguage keyList', () => {
        expect.hasAssertions();

        const st1: string[] = [
            ...(repository.keylist.patterns[0].match)
                .replace('\\b(?i:', '')
                .replace('|vk[a-f\\d]{1,2}(sc[a-f\\d]+)?|sc[a-f\\d]+)\\b', '')
                .toLowerCase()
                .split('|'),
            ...(repository.keylist.patterns[1].match)
                .replace('\\b(1[0-6]|[1-9])?(?i:', '')
                .replace(')\\b', '')
                .toLowerCase()
                .split('|'),
        ].sort();

        expect(st1).toStrictEqual(keyList.map((key: string): string => key.toLowerCase()).sort());
    });

    it('check : tmLanguage keyword_mouse_keyboard', () => {
        expect.hasAssertions();

        const st1: string[] = [
            ...(repository.keyword_mouse_keyboard.patterns[0].match)
                .replace('(?<![.#])\\b(?i:', '')
                .replace('|vk[a-f\\d]{1,2}(sc[a-f\\d]+)?|sc[a-f\\d]+)\\b(?!\\()', '')
                .toLowerCase()
                .split('|'),
            ...(repository.keyword_mouse_keyboard.patterns[1].match)
                .replace('(?<![.#])\\b(1[0-6]|[1-9])?(?i:', '')
                .replace(')\\b(?!\\()', '')
                .toLowerCase()
                .split('|'),
        ].sort();

        expect(st1).toStrictEqual(keyList.map((key: string): string => key.toLowerCase()).sort());
    });

    it('check : tmLanguage keyword_mouse_keyboard AltTab', () => {
        expect.hasAssertions();

        const st1: string[] = (repository.keyword_mouse_keyboard.patterns[2].match)
            .replace('(?<![.#])\\b(?i:', '')
            .replace(')\\b(?!\\()', '')
            .split('|')
            .sort();

        expect(st1).toStrictEqual([...keyListAltTab].sort());
    });
});

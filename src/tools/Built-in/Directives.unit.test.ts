import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { DirectivesList } from './Directives.data';

describe('check #Directive ruler', () => {
    const max = 37;

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        const arr1: string[] = DirectivesList
            .map((v): string => v.keyRawName.replace('#', ''))
            .sort();

        const st1 = (repository.directives.patterns.at(-1)?.begin ?? '')
            .replace('^[ \\t]*(#\\b(?i:', '')
            .replace('))\\b', '');

        expect(arr1).toHaveLength(max);
        expect(st1).toBe(arr1.join('|'));
    });

    it('check : uri', () => {
        expect.hasAssertions();

        type TSpecialUri = [
            string,
            typeof DirectivesList[number]['link'],
        ];
        const specialUriList: TSpecialUri[] = [];
        for (const v of DirectivesList) {
            const { link, keyRawName } = v;

            const tag = link
                .replace('https://www.autohotkey.com/docs/v1/lib/_', '')
                .replace('.htm', '');
            if (tag !== keyRawName.replace(/^#/u, '')) {
                specialUriList.push([keyRawName, link]);
            }
        }

        expect(specialUriList).toStrictEqual([
            ['#Delimiter', 'https://www.autohotkey.com/docs/v1/lib/_EscapeChar.htm#Delimiter'],
            ['#DerefChar', 'https://www.autohotkey.com/docs/v1/lib/_EscapeChar.htm#DerefChar'],
            // #IfWinActive / #IfWinNotActive / #IfWinExist / #IfWinNotExist
            ['#IfWinExist', 'https://www.autohotkey.com/docs/v1/lib/_IfWinActive.htm'],
            ['#IfWinNotActive', 'https://www.autohotkey.com/docs/v1/lib/_IfWinActive.htm'],
            ['#IfWinNotExist', 'https://www.autohotkey.com/docs/v1/lib/_IfWinActive.htm'],
            // #Include / #IncludeAgain
            ['#IncludeAgain', 'https://www.autohotkey.com/docs/v1/lib/_Include.htm'],

            // ( LTrim flag
            ['#LTrim', 'https://www.autohotkey.com/docs/v1/Scripts.htm#LTrim'],
        ]);
    });
});

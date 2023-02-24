import { repository } from '../../../syntaxes/ahk.tmLanguage.json';
import { otherKeyword1 } from './otherKeyword1.data';

describe('check otherKeyword1 ruler', () => {
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const tsStr = otherKeyword1
            .map((v) => v.keyRawName)
            .join('|')
            .replace('Class|', '');

        const st1 = (repository.other_keyword.patterns[0].match)
            .replace('(?:^|[ \\t{])(?i:', '')
            .replace(')(?:$|[ \\t])', '');

        expect(st1).toBe(tsStr);
    });
});

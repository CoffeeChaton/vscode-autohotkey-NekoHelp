import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
import { RegRootList } from './RegRootKey.data';

describe('check RegRoot ruler', () => {
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const tsStr: string = RegRootList.join('|');

        const st1: string = (repository.const_var_reg.match)
            .replace('(?<=[, \\t:])(?i:(', '')
            .replace('))(?=[, \\t\\\\])', '');

        expect(st1).toBe(tsStr);
    });
});

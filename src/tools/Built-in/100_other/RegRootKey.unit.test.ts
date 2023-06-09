import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
import { RegRootList } from './RegRootKey.data';

describe('check RegRoot ruler', () => {
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const tsStr: string = RegRootList.join('|');

        const st1: string = (repository.flow_of_control_loop_reg.patterns[0].match)
            .replace('(?<=[, \\t:])(?i:(', '')
            .replace('))(?=[, \\t\\\\])', '');

        const st2: string = (repository.flow_of_control_loop_old.patterns[0].match)
            .replace('(?<=[, \\t:])(?i:(', '')
            .replace('))(?=[, \\t\\\\])', '');

        expect(st1).toBe(tsStr);
        expect(st2).toBe(tsStr);
    });
});

import { describe, expect, it } from '@jest/globals';
import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
import { operatorDataList } from './operator.data';

describe('check otherKeyword2 ruler', () => {
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const tsStr = operatorDataList
            .map((v) => v.keyRawName)
            .join('|');

        const st1 = repository.operator.match
            .replace('(?<=^|[#$@%!"/&\'()*+,\\-:;<=>?[\\^\\\\]{|}~ \\t])(?i:', '')
            .replace(')(?:$|[ \\t])', '');

        expect(st1).toBe(tsStr);
    });
});

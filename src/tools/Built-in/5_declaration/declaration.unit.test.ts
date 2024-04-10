import { describe, expect, it } from '@jest/globals';
import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
import { declarationDataList } from './declaration.data';

describe('check declaration ruler', () => {
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const tsStr: string = declarationDataList
            .map((v) => v.keyRawName)
            .join('|')
            .replace('Class|', '');

        const st1: string = repository.declaration.match
            .replace('^[ \\t{]*(?i:', '')
            .replace(')(?=$|[ \\t])', '');

        expect(st1).toBe(tsStr);
    });
});

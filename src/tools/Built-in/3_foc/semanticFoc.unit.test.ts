import { Statement } from './foc.data';
import {
    FocIfExMap,
    FocOtherSet,
    FocSetOneLine,
    FocSetSwitchCase,
    FocTrySet,
} from './semanticFoc.data';

describe('check semanticFoc ruler', () => {
    it('check: semanticFoc', () => {
        expect.hasAssertions();

        const full = new Set(Statement.map((v): string => v.upName));

        const arr: string[] = [
            ...FocSetOneLine,
            ...FocSetSwitchCase,
            ...FocIfExMap.keys(),
            ...FocTrySet,
            ...FocOtherSet,
        ];
        for (const str of arr) {
            if (full.has(str)) {
                full.delete(str);
            } else {
                full.add(`not_find_(${str})`);
            }
        }

        expect([...full]).toStrictEqual([]);
    });
});

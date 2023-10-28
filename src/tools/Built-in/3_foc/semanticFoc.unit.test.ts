import { Statement } from './foc.data';
import {
    FocIfExMap,
    FocOtherSet,
    FocTrySet,
} from './semanticFoc.data';

const FocSetOneLine: ReadonlySet<string> = new Set([
    'Break',
    'Continue',
    'Critical',
    'Exit',
    'ExitApp',
    'GoSub',
    'Goto',
    'Pause',
    'Reload',
    'Return',
    'Throw',
    'Until',
].map((s) => s.toUpperCase()));

const FocSetSwitchCase: ReadonlySet<string> = new Set([
    'Switch',
    'Case',
    'Default',
].map((s) => s.toUpperCase()));

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

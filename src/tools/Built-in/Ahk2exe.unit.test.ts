import { repository } from '../../../syntaxes/ahk.tmLanguage.json';

import { Ahk2exeData } from './Ahk2exe.data';

type TErrObj = {
    msg: string,
    value: unknown,
};

describe('check Ahk2exeData ruler', () => {
    const max = 30;

    it('check : Ahk2exeData length .EQ. 30', () => {
        expect.hasAssertions();

        expect(Ahk2exeData).toHaveLength(max);
    });

    it('check : name ruler', () => {
        expect.hasAssertions();

        const errList: TErrObj[] = [];
        for (const v of Ahk2exeData) {
            const {
                keyRawName,
                body,
                exp,
            } = v;

            const v3 = !body.toUpperCase().includes(keyRawName.toUpperCase());
            const v4 = !exp.join('\n').includes(keyRawName);

            if (v3 || v4) {
                errList.push({
                    msg: '--15--37--51--76--66',
                    value: {
                        v3,
                        v4,
                        keyRawName,
                        v,
                    },
                });
                break;
            }
        }

        expect(errList).toHaveLength(0);
    });

    it('check : tmLanguage', () => {
        expect.hasAssertions();

        const st1: string = (repository.comment_ahk2exe.match)
            .replace('^[ \\t]*;(?i:@Ahk2Exe-(', '')
            .replace(')\\b).*', '');

        const arr: string = Ahk2exeData
            .map((v): string => v.keyRawName)
            .join('|');

        expect(st1).toBe(arr);
    });
});

import { repository } from '../syntaxes/ahk.tmLanguage.json';

describe('check tmLanguage ruler', () => {
    it('check : repository key_name should be snake_case', () => {
        expect.hasAssertions();

        const errList0: string[] = [];
        for (const keyName of Object.keys(repository)) {
            if (!(/^[a-z][a-z\d_]+$/u).test(keyName)) {
                errList0.push(keyName);
            }
        }

        expect(errList0).toHaveLength(0);
    });

    it('check : all name is [a-z_0-9]', () => {
        expect.hasAssertions();

        type TErrObj = {
            msg: string,
            value: unknown,
        };

        const errList0: TErrObj[] = [];
        JSON.stringify(repository, (key: string, value: unknown): unknown => {
            if (key !== 'name') return value;

            if (typeof value !== 'string') {
                errList0.push({ msg: 'value not string', value });
                return value;
            }

            if (!(/^[a-z][a-z\d_.]+$/u).test(value)) {
                errList0.push({ msg: 'name not match a-z_0-9', value });
            }

            if (!(/[a-z]\.ahk$/u).test(value)) {
                errList0.push({ msg: 'name not end with .ahk', value });
            }

            return value;
        });

        expect(errList0).toHaveLength(0);
    });
});

import { contributes } from '../package.json';
import * as nls_en from '../package.nls.json';
import * as nls_cn from '../package.nls.zh-cn.json';
import * as nls_tw from '../package.nls.zh-tw.json';
//

describe('check nls', () => {
    it('check : nls', () => {
        expect.hasAssertions();

        const errList0: string[] = [];
        // const log: string[] = [];

        const nlsEn: ReadonlySet<string> = new Set(Object.keys(nls_en));
        const nlsCn: ReadonlySet<string> = new Set(Object.keys(nls_cn));
        const nlsTW: ReadonlySet<string> = new Set(Object.keys(nls_tw));

        function deepJson(obj: NonNullable<unknown>): void {
            for (const [_k, v] of Object.entries(obj)) {
                if (typeof v === 'object' && v !== null) {
                    deepJson(v);
                }

                if (
                    typeof v === 'string'
                    && v.startsWith('%')
                    && v.endsWith('%')
                ) {
                    const vv: string = v.replaceAll('%', '');

                    // log.push(vv);
                    if (!nlsEn.has(vv)) {
                        errList0.push(`nlsEn not found${vv}`);
                    }

                    if (!nlsCn.has(vv)) {
                        errList0.push(`nlsCn not found${vv}`);
                    }

                    if (!nlsTW.has(vv)) {
                        errList0.push(`nlsTW not found${vv}`);
                    }
                }
            }
        }

        for (const v0 of contributes.configuration) {
            deepJson(v0);
        }

        for (const [k, v] of Object.entries(nls_en)) {
            // eslint-disable-next-line no-control-regex
            if ((/[^\u0000-\u007F]/u).test(v)) errList0.push(`There is Chinese "${k}"`);
        }

        expect(errList0).toHaveLength(0);
    });
});

import { contributes } from '../package.json';
import * as nls from '../package.nls.json';
import * as nls_cn from '../package.nls.zh-cn.json';
//

describe('check nls', () => {
    it('check : nls', () => {
        expect.hasAssertions();

        const errList0: string[] = [];
        // const log: string[] = [];

        const nlsJs: ReadonlySet<string> = new Set(Object.keys(nls));
        const nlsCnJs: ReadonlySet<string> = new Set(Object.keys(nls_cn));

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
                    if (!nlsJs.has(vv)) {
                        errList0.push(`nls not found${vv}`);
                    }

                    if (!nlsCnJs.has(vv)) {
                        errList0.push(`nls_cn not found${vv}`);
                    }
                }
            }
        }

        for (const v0 of contributes.configuration) {
            deepJson(v0);
        }

        expect(errList0).toHaveLength(0);
    });
});

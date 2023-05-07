import {
    base16toNumber,
    to0X,
    winMsg,
} from './Windows_Messages.data';

describe('check Windows_Messages', () => {
    it('check Windows_Messages name ruler', () => {
        expect.hasAssertions();

        const errState: string[] = [];
        for (const [wm, [base10, base16]] of winMsg.entries()) {
            if (!wm.startsWith('WM_')) {
                errState.push(`${wm} startsWith error`);
                break;
            }
            if (wm.toUpperCase() !== wm) {
                errState.push(`${wm} toUpperCase error`);
                break;
            }
            if (base16toNumber(base16) !== base10) {
                errState.push(`${wm} base16 error`);

                break;
            }
        }

        expect(errState).toStrictEqual([]);

        // https://www.autohotkey.com/docs/v1/misc/SendMessageList.htm at 2022/7/23

        // eslint-disable-next-line no-magic-numbers
        expect(winMsg.size === 207).toBeTruthy();
    });

    it('1000 to "0x03E8"', () => {
        expect.hasAssertions();

        const number1000 = 1000;

        expect(to0X(number1000) === '0x03E8').toBeTruthy();
    });

    it('"0x03E8" to 1000', () => {
        expect.hasAssertions();

        const number1000 = 1000;

        expect(base16toNumber('0x03E8') === number1000).toBeTruthy();
    });
});

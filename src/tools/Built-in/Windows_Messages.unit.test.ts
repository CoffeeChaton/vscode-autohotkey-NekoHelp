import {
    base16toNumber,
    to0X,
    winMsg,
    winMsgRe,
} from './Windows_Messages';

describe('check Windows_Messages', () => {
    it('check Windows_Messages name ruler', () => {
        expect.hasAssertions();

        let errState = 0;
        for (const [wm, [base10, base16]] of winMsg.entries()) {
            if (!wm.startsWith('WM_')) {
                console.error('!wm.startsWith("WM_")', wm);
                errState++;
                break;
            }
            if (wm.toUpperCase() !== wm) {
                console.error('wm.toUpperCase() !== wm', wm);
                errState++;
                break;
            }
            if (base16toNumber(base16) !== base10) {
                console.error('base16toNumber(base16) !== base10', {
                    wm,
                    base16toNumber: base16toNumber(base16),
                    base10,
                });
                errState++;
                break;
            }
        }

        expect(errState === 0).toBeTruthy();

        // https://www.autohotkey.com/docs/v1/misc/SendMessageList.htm at 2022/7/23

        // eslint-disable-next-line no-magic-numbers
        expect(winMsg.size === 207).toBeTruthy();

        // eslint-disable-next-line no-magic-numbers
        expect(winMsgRe.size === 201).toBeTruthy();
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

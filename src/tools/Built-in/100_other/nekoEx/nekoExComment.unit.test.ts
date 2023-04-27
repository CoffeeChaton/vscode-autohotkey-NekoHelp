import { nekoExCommentData } from './nekoExComment.data';

describe('check nekoExComment ruler', (): void => {
    it('check : nekoExComment Data', (): void => {
        expect.hasAssertions();

        type TErrObj = {
            case: number,
            label: typeof nekoExCommentData[0]['label'],
            value: string,
        };

        const errList: TErrObj[] = [];
        for (const { label, exp } of nekoExCommentData) {
            const labelFix: string = label.includes('XX')
                ? label.replace(/\bxx.*/iu, '')
                : label;
            if (!exp.join('\n').includes(labelFix)) errList.push({ case: 1, label, value: exp.join('\n') });
        }

        const max = 6;

        expect(nekoExCommentData).toHaveLength(max);
        expect(errList).toStrictEqual([
            //
        ]);
    });
});

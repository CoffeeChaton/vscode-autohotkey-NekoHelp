import { WinTitleParameterData } from './WinTitleParameter.data';

describe('check WinTitle ruler', () => {
    it('check : tmLanguage ahk_pid', () => {
        expect.hasAssertions();

        const str1: string = WinTitleParameterData
            .map((v): string => v.body)
            .join('|');

        expect(str1).toBe('ahk_class|ahk_id|ahk_pid|ahk_exe|ahk_group');
    });
});

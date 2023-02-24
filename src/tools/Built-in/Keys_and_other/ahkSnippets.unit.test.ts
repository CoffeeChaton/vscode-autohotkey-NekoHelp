import { repository } from '../../../../syntaxes/ahk.tmLanguage.json';
import { ahkSnippetsData } from './ahkSnippets.data';

describe('check ahkSnippets ruler', () => {
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    const snipList: string[] = ahkSnippetsData.map((v: string): string => v.toLowerCase()).sort();

    const max = 232;

    it(`check : ahkSnippets length .EQ. ${max}`, () => {
        expect.hasAssertions();

        expect(snipList).toHaveLength(max);
    });

    //
    it('check : tmLanguage', () => {
        expect.hasAssertions();

        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        const tmLanguageArr: string[] = (repository.command_options.match)
            .replace('\\b(?!MsgBox)(?<![.#])(?i:', '')
            .replace(')(?![(.\\[])\\b', '')
            .split('|')
            .sort();

        const set = new Set<string>(tmLanguageArr);
        const rmList: string[] = [
            // WinTitle -> has .data.ts
            'ahk_class',
            'ahk_id',
            'ahk_pid',
            'ahk_exe',
            'ahk_group',
            // just in this cmd https://www.autohotkey.com/docs/v1/lib/SetNumScrollCapsLockState.htm
            'AlwaysOn',
            'AlwaysOff',

            // GUI -> // bold, italic, strike, underline
            // 'Bold',
            // 'italic',
            // 'strike',
            // 'underline',
            'xp',
            'xs',
            'xm',
            'x+m',
            'ym',
            'yp',
            'ys',
            // other
            'Blind', // Send {Blind}{vk07}
            'Click', // Menu, Tray, Click, ClickCount
            'Delete', // Control, Delete
        ].map((v: string): string => v.toLowerCase());
        for (const v of rmList) {
            set.delete(v);
        }

        expect(snipList).toStrictEqual([...set]);
    });
});

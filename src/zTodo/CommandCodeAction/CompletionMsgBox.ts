/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../globalEnum';

const MsgBoxParam = (() => {
    type TMsgBoxParamElement = {
        base10: number,
        doc: string,
        group: `Group #${string}`,
    };

    const MsgBoxParamData: TMsgBoxParamElement[] = [
        // Group #1: Buttons
        {
            base10: 0,
            doc: 'OK (that is, only an OK button is displayed)',
            group: 'Group #1: Buttons',
        },
        {
            base10: 1,
            doc: 'OK/Cancel',
            group: 'Group #1: Buttons',
        },
        {
            base10: 2,
            doc: 'Abort/Retry/Ignore',
            group: 'Group #1: Buttons',
        },
        {
            base10: 3,
            doc: 'Yes/No/Cancel',
            group: 'Group #1: Buttons',
        },
        {
            base10: 4,
            doc: 'Yes/No',
            group: 'Group #1: Buttons',
        },
        {
            base10: 5,
            doc: 'Retry/Cancel',
            group: 'Group #1: Buttons',
        },
        {
            base10: 6,
            doc: 'Cancel/Try Again/Continue',
            group: 'Group #1: Buttons',
        },
        // Group #2: Icon
        {
            base10: 16,
            doc: 'Icon Hand (stop/error)',
            group: 'Group #2: Icon',
        },
        {
            base10: 32,
            doc: 'Icon Question',
            group: 'Group #2: Icon',
        },
        {
            base10: 48,
            doc: 'Icon Exclamation',
            group: 'Group #2: Icon',
        },
        {
            base10: 64,
            doc: 'Icon Asterisk (info)',
            group: 'Group #2: Icon',
        },
        // Group #3: Default Button
        {
            base10: 256,
            doc: 'Makes the 2nd button the default',
            group: 'Group #3: Default Button',
        },
        {
            base10: 512,
            doc: 'Makes the 3rd button the default',
            group: 'Group #3: Default Button',
        },
        {
            base10: 768,
            doc: 'Makes the 4th button the default(requires the Help button to be present)',
            group: 'Group #3: Default Button',
        },
        // Group #4: Modality
        {
            base10: 4096,
            doc: 'System Modal (always on top)',
            group: 'Group #4: Modality',
        },
        {
            base10: 8192,
            doc: 'Task Modal',
            group: 'Group #4: Modality',
        },
        {
            base10: 262_144,
            doc: 'Always-on-top (style WS_EX_TOPMOST)(like System Modal but omits title bar icon)',
            group: 'Group #4: Modality',
        },
        // Group #5: Other Options
        {
            base10: 16_384,
            doc: 'Adds a Help button (see remarks below)',
            group: 'Group #5: Other Options',
        },
        {
            base10: 524_288,
            doc: 'Make the text right-justified',
            group: 'Group #5: Other Options',
        },
        {
            base10: 1_048_576,
            doc: 'Right-to-left reading order for Hebrew/Arabic',
            group: 'Group #5: Other Options',
        },
    ];

    for (const { base10, doc, group } of MsgBoxParamData) {
        // eslint-disable-next-line no-magic-numbers
        const x16 = `0x${base10.toString(16)}`;
        // o2[x16] = {
        //     base10: key,
        //     doc: v,
        //     group: 'Group #0',
        // };
    }

    return 0;
})();

function CompletionMsgBox(AhkTokenLine: TAhkTokenLine): void {
    // const edit = new vscode.WorkspaceEdit();
    // edit.insert(uri, position, '_');
    // await vscode.workspace.applyEdit(edit);
    //
}

export type TCompletionMsgBoxParam = Parameters<typeof CompletionMsgBox>;

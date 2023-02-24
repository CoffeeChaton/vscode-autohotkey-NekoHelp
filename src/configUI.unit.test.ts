/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { contributes } from '../package.json';

describe('check package ruler', () => {
    it('check : repository key_name should be snake_case', () => {
        expect.hasAssertions();

        const errList0: string[] = [];
        const msg: [string, string][] = [];

        for (const [k, v] of Object.entries(contributes.configuration[0].properties)) {
            if (!k.startsWith('AhkNekoHelp.CodeLens')) errList0.push(k);

            msg.push([k, v.type as unknown as string]);
        }

        for (const [k, v] of Object.entries(contributes.configuration[1].properties)) {
            if (!k.startsWith('AhkNekoHelp.Diag')) errList0.push(k);

            msg.push([k, v.type as unknown as string]);
        }

        for (const [k, v] of Object.entries(contributes.configuration[2].properties)) {
            if (!k.startsWith('AhkNekoHelp.format')) errList0.push(k);

            msg.push([k, v.type as unknown as string]);
        }

        for (const [k, v] of Object.entries(contributes.configuration[3].properties)) {
            if (!k.startsWith('AhkNekoHelp.')) errList0.push(k);

            msg.push([k, v.type as unknown as string]);
        }

        expect(errList0).toHaveLength(0);
        expect(msg).toStrictEqual(
            [
                // [0]
                ['AhkNekoHelp.CodeLens.showFuncReference', 'boolean'],
                ['AhkNekoHelp.CodeLens.showDevTool', 'boolean'],
                ['AhkNekoHelp.CodeLens.showFileReport', 'boolean'],
                // [1]
                ['AhkNekoHelp.Diag.AMasterSwitch', 'string'],
                ['AhkNekoHelp.Diag.code107LegacyAssignment', 'boolean'],
                ['AhkNekoHelp.Diag.code300FuncSize', 'number'],
                ['AhkNekoHelp.Diag.code304AvoidConfusingFuncNames', 'boolean'],
                ['AhkNekoHelp.Diag.code500', 'number'],
                ['AhkNekoHelp.Diag.code502', 'number'],
                ['AhkNekoHelp.Diag.code503', 'number'],
                ['AhkNekoHelp.Diag.code511', 'number'],
                ['AhkNekoHelp.Diag.code512', 'number'],
                ['AhkNekoHelp.Diag.code513', 'number'],
                ['AhkNekoHelp.Diag.code800Deprecated', 'boolean'],
                ['AhkNekoHelp.Diag.useModuleValDiag', 'boolean'],
                // [2]
                ['AhkNekoHelp.format.AMasterSwitchUseFormatProvider', 'boolean'],
                ['AhkNekoHelp.format.textReplace', 'boolean'],
                ['AhkNekoHelp.format.useTopLabelIndent', 'boolean'],
                ['AhkNekoHelp.format.useParenthesesIndent', 'boolean'],
                ['AhkNekoHelp.format.useSquareBracketsIndent', 'boolean'],
                // misc
                ['AhkNekoHelp.baseScan.IgnoredList', 'array'],
                ['AhkNekoHelp.snippets.CommandOption', 'number'],
                ['AhkNekoHelp.snippets.blockFilesList', 'array'],
                ['AhkNekoHelp.statusBar.displayColor', 'string'],
                ['AhkNekoHelp.useSymbolProvider', 'boolean'],
                ['AhkNekoHelp.customize.CodeAction2GotoDefRef', 'boolean'],
                ['AhkNekoHelp.Rename.functionInStr', 'boolean'],
            ],
        );
    });
});

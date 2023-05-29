/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { contributes } from '../package.json';

describe('check package ruler', () => {
    it('check : repository key_name should be snake_case', () => {
        expect.hasAssertions();

        const errList0: string[] = [];
        const msg: [string, string][] = [];

        const arr = [
            'AhkNekoHelp.CodeLens.',
            'AhkNekoHelp.Diag.',
            'AhkNekoHelp.format.',
            'AhkNekoHelp.snippets.',
            'AhkNekoHelp.customize.',
            'AhkNekoHelp.files.',
            'AhkNekoHelp.signatureHelp.',

            'AhkNekoHelp.',
        ];

        for (const [i, starts] of arr.entries()) {
            for (const [k, v] of Object.entries(contributes.configuration[i].properties)) {
                if (!k.startsWith(starts)) errList0.push(k);
                msg.push([k, v.type as unknown as string]);
            }
        }

        const absolutePath = path.join(__dirname, '../note/config');
        const files: string[] = fs.readdirSync(absolutePath);
        for (const file of files) {
            if (!file.endsWith('.md')) {
                errList0.push(`not md: ${file}`);
                continue;
            }

            const section = `AhkNekoHelp.${file.replace(/.md$/u, '')}`;
            const find: boolean = msg.some((v): boolean => v[0] === section);
            if (!find) {
                errList0.push(`not find section in pack.json: ${file}`);
            }
        }

        expect(errList0).toHaveLength(0);
        expect(msg).toStrictEqual(
            [
                // [0]
                ['AhkNekoHelp.CodeLens.showClassReference', 'boolean'],
                ['AhkNekoHelp.CodeLens.showFuncReference', 'boolean'],
                ['AhkNekoHelp.CodeLens.showLabelReference', 'boolean'],
                ['AhkNekoHelp.CodeLens.showComObjConnectRegisterStrReference', 'boolean'],
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
                ['AhkNekoHelp.format.removeFirstCommaDirective', 'boolean'],
                ['AhkNekoHelp.format.removeFirstCommaCommand', 'number'],
                ['AhkNekoHelp.format.useTopLabelIndent', 'boolean'],
                ['AhkNekoHelp.format.useParenthesesIndent', 'boolean'],
                ['AhkNekoHelp.format.useSquareBracketsIndent', 'boolean'],
                // [3]
                ['AhkNekoHelp.snippets.CommandOption', 'number'],
                ['AhkNekoHelp.snippets.exclude', 'array'],
                ['AhkNekoHelp.snippets.fromOtherFile', 'number'],
                ['AhkNekoHelp.snippets.subCmdPlus', 'object'],

                // [4]
                ['AhkNekoHelp.customize.statusBarDisplayColor', 'string'],
                ['AhkNekoHelp.customize.HoverFunctionDocStyle', 'number'],
                ['AhkNekoHelp.customize.CodeAction2GotoDefRef', 'boolean'],
                ['AhkNekoHelp.customize.displayLogMessage', 'string'],

                // [5]
                ['AhkNekoHelp.files.exclude', 'array'],
                ['AhkNekoHelp.files.tryParserIncludeOpt', 'string'],
                ['AhkNekoHelp.files.tryParserIncludeLog', 'object'],

                // [6]
                ['AhkNekoHelp.signatureHelp.insertType', 'boolean'],
                ['AhkNekoHelp.signatureHelp.showParamInfo', 'boolean'],
                ['AhkNekoHelp.signatureHelp.showOtherDoc', 'boolean'],
                ['AhkNekoHelp.signatureHelp.showReturnInfo', 'boolean'],
                ['AhkNekoHelp.signatureHelp.showReturnBlock', 'string'],

                // [7] misc
                ['AhkNekoHelp.method', 'object'],
                ['AhkNekoHelp.useSymbolProvider', 'boolean'],
                ['AhkNekoHelp.SymbolProvider.showInclude', 'boolean'],
                ['AhkNekoHelp.Rename.functionInStr', 'boolean'],
                ['AhkNekoHelp.event.FileRenameEvent', 'number'],
            ],
        );
    });
});

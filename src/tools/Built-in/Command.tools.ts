/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as vscode from 'vscode';
import { Diags } from '../../diag';
import type { TAllowDiagCode } from './Command.data';
import { LineCommand } from './Command.data';
import { CSnippetCommand } from './CSnippetCommand';

export const {
    snippetCommand,
    CommandMDMap,
    CommandErrMap,
    OutputCommandBaseMap,
    OutputCommandPlusMap,
    inPutVarMap,
} = (() => {
    const CommandMDMapTemp = new Map<string, vscode.MarkdownString>();
    const snippetCommandTemp: CSnippetCommand[] = [];
    const CommandErrMapTemp = new Map<string, TAllowDiagCode>();

    const outBaseMapRW = new Map<string, number>();
    const outPlusMapRW = new Map<string, readonly number[]>();
    const inPutVarMapRw = new Map<string, readonly number[]>();

    function Param2List(defStr: string[]): number[] {
        const arr: number[] = [];

        for (const [i, s] of defStr.entries()) {
            if (s === 'O') {
                arr.push(i + 1);
            }
        }
        return arr;
    }

    for (const v of LineCommand) {
        const {
            body,
            doc,
            link, // string | undefined
            exp, // string[] | undefined
            diag,
            upName,
            _paramType,
        } = v;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown('Command')
            .appendCodeblock(body, 'ahk')
            .appendMarkdown(`[(Read Doc)](${link})\n\n`)
            .appendMarkdown(doc)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'), 'ahk');

        if (diag !== undefined) {
            const { msg, path } = Diags[diag];
            md
                .appendMarkdown(`\n\n***\n\n**warn:** ${msg}`)
                .appendMarkdown(`[(Read Warn ${diag})](${path})`);
        }
        md.supportHtml = true;
        CommandMDMapTemp.set(upName, md);

        if (upName !== 'GUI') {
            snippetCommandTemp.push(new CSnippetCommand(v, md));
        }

        if (diag !== undefined) {
            CommandErrMapTemp.set(upName, diag);
        }

        const paramList: readonly number[] = Param2List(_paramType);
        //
        if (paramList.length === 1 && _paramType[0] === 'O') {
            outBaseMapRW.set(upName, upName.length);
        } else if (paramList.length > 0) {
            outPlusMapRW.set(upName, paramList);
        }

        if (_paramType.includes('I')) {
            inPutVarMapRw.set(upName, paramList);
        }
    }

    /**
     * after initialization clear
     */
    LineCommand.length = 0;

    // ---
    // Catch, e
    outBaseMapRW.set('CATCH', 'CATCH'.length);
    // ---
    return {
        snippetCommand: snippetCommandTemp as readonly CSnippetCommand[],
        CommandMDMap: CommandMDMapTemp as ReadonlyMap<string, vscode.MarkdownString>,
        CommandErrMap: CommandErrMapTemp as ReadonlyMap<string, TAllowDiagCode>,
        //
        OutputCommandBaseMap: outBaseMapRW as ReadonlyMap<string, number>,
        OutputCommandPlusMap: outPlusMapRW as ReadonlyMap<string, readonly number[]>,
        inPutVarMap: inPutVarMapRw as ReadonlyMap<string, readonly number[]>,
    };
})();

export function getHoverCommand2(wordUp: string): vscode.MarkdownString | undefined {
    return CommandMDMap.get(wordUp);
}

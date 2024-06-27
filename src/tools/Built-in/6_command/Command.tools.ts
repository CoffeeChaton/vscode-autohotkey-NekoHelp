/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as vscode from 'vscode';
import { Diags } from '../../../diag';
import { initNlsDefMap, readNlsJson } from '../nls_json.tools';
import type { TAllowDiagCode, TCommandElement, TCommandParams } from './Command.data';
import { CSnippetCommand } from './CSnippetCommand';

export type TCmdMsg = {
    readonly md: vscode.MarkdownString,
    readonly keyRawName: string,
    readonly _param: readonly TCommandParams[],
    readonly cmdSignLabel: string,
    readonly link: TCommandElement['link'],
};

const tmep_cmd = (() => {
    const CommandMDMapTemp = new Map<string, TCmdMsg>();
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

    const LineCommand: TCommandElement[] = readNlsJson('Command') as TCommandElement[];
    for (const v of LineCommand) {
        const {
            _param,
            _paramType,
            diag,
            doc,
            exp,
            keyRawName,
            link,
        } = v;
        const upName: string = keyRawName.toUpperCase();
        let cmdSignLabel: string = keyRawName;
        let isFirstOption = 0;
        for (const commandParams of _param) {
            const { name, isOpt } = commandParams;
            if (isOpt) {
                isFirstOption++;
            }
            cmdSignLabel += isFirstOption === 1
                ? ` [, ${name}`
                : `, ${name}`;
        }
        if (isFirstOption > 0) {
            cmdSignLabel += ']';
        }

        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown('Command')
            .appendCodeblock(cmdSignLabel, 'ahk')
            .appendMarkdown(`[(Read Doc)](${link})\n\n`)
            .appendMarkdown(doc.join('\n'))
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
        CommandMDMapTemp.set(upName, {
            _param,
            cmdSignLabel,
            keyRawName,
            md,
            link,
        });

        snippetCommandTemp.push(new CSnippetCommand(v, md));

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

    // ---
    // Catch, e
    outBaseMapRW.set('CATCH', 'CATCH'.length);
    // ---
    return {
        snippetCommandTemp,
        CommandMDMapTemp,
        CommandErrMapTemp,
        //
        outBaseMapRW,
        outPlusMapRW,
        inPutVarMapRw,
    };
})();

export const Cmd_Snip: readonly CSnippetCommand[] = tmep_cmd.snippetCommandTemp;
export const Cmd_MDMap: ReadonlyMap<string, TCmdMsg> = tmep_cmd.CommandMDMapTemp;
export const Cmd_ErrMap: ReadonlyMap<string, TAllowDiagCode> = tmep_cmd.CommandErrMapTemp;
export const Cmd_OutputBaseMap: ReadonlyMap<string, number> = tmep_cmd.outBaseMapRW;
export const Cmd_OutputPlusMap: ReadonlyMap<string, readonly number[]> = tmep_cmd.outPlusMapRW;
export const Cmd_InPutVarMap: ReadonlyMap<string, readonly number[]> = tmep_cmd.inPutVarMapRw;

export function getHoverCommand2(wordUp: string): vscode.MarkdownString | undefined {
    return Cmd_MDMap.get(wordUp)?.md;
}

export const cmdDefMap: ReadonlyMap<string, [vscode.Location]> = initNlsDefMap('Command');

import * as vscode from 'vscode';
import type { TAhkFileData } from '../../core/ProjectManager';
import type { TAhkTokenLine, TTokenStream } from '../../globalEnum';
import { FormatCoreWrap } from '../../provider/Format/FormatProvider';
import type { TFmtCore, TFmtCoreMap } from '../../provider/Format/FormatType';
import { fmtLog } from '../../provider/vscWindows/log';
import { CommandMDMap } from '../../tools/Built-in/Command.tools';

type TCmdSwitchComma = {
    col: number,
    AhkTokenLine: TAhkTokenLine,
};

function getCmdSwitchCommaList(DocStrMap: TTokenStream, selection: vscode.Selection): readonly TCmdSwitchComma[] {
    const result: TCmdSwitchComma[] = [];
    const logList: string[] = ['"match cmd" : ['];
    const { start, end } = selection;
    const s: number = start.line;
    const e: number = end.line;
    fmtLog.info(`select range of line [${s}, ${e}]`);

    for (let i = s; i <= e; i++) {
        const AhkTokenLine: TAhkTokenLine = DocStrMap[i];
        const {
            fistWordUp,
            fistWordUpCol,
            SecondWordUp,
            SecondWordUpCol,
            lStr,
            textRaw,
            line,
        } = AhkTokenLine;
        if (fistWordUp === '') continue;

        if (CommandMDMap.has(fistWordUp)) {
            const col: number = fistWordUp.length + fistWordUpCol;
            if (lStr.trimEnd().length !== col) {
                result.push({
                    col,
                    AhkTokenLine,
                });
                logList.push(`    ${line} -> "${textRaw.slice(fistWordUpCol, lStr.length).trim()}"`);
                continue;
            }
        }
        if (CommandMDMap.has(SecondWordUp)) {
            const col: number = SecondWordUp.length + SecondWordUpCol;
            if (lStr.trimEnd().length !== col) {
                result.push({
                    col,
                    AhkTokenLine,
                });
                logList.push(`    ${line} -> "${textRaw.slice(SecondWordUpCol, lStr.length).trim()}"`);
            }
        }
    }

    logList.push(']');
    fmtLog.info(logList.join('\n'));
    return result;
}

function RemoveFirstOptComma(list: readonly TCmdSwitchComma[]): TFmtCoreMap {
    const map = new Map<number, TFmtCore>();
    for (const { col, AhkTokenLine } of list) {
        const { textRaw, line } = AhkTokenLine;
        const strF: string = textRaw.slice(col).trim();
        if ((/^,\s*[^,]/u).test(strF)) {
            map.set(line, {
                line,
                oldText: textRaw,
                newText: textRaw.slice(0, col).trimEnd() + strF.replace(/^,\s*/u, ' ').trimEnd(),
                hasOperatorFormat: false,
            });
        }
    }
    return map;
}

function unRemoveFirstOptComma(list: readonly TCmdSwitchComma[]): TFmtCoreMap {
    const map = new Map<number, TFmtCore>();
    for (const { col, AhkTokenLine } of list) {
        const { textRaw, line } = AhkTokenLine;
        const strF: string = textRaw.slice(col).trim();
        if ((/^[^,]/u).test(strF)) {
            map.set(line, {
                line,
                oldText: textRaw,
                newText: textRaw.slice(0, col).trimEnd() + strF.replace(/^\s*/u, ', ').trimEnd(),
                hasOperatorFormat: false,
            });
        }
    }
    return map;
}

function applyVscodeEdit(map: TFmtCoreMap): vscode.TextEdit[] {
    const logList: string[] = [];
    for (const { line, oldText, newText } of map.values()) {
        logList.push(
            `    {   line : ${line}`,
            `        oldText : '${oldText}',`,
            `        newText : '${newText}',`,
            '    },',
        );
    }

    if (logList.length > 0) {
        fmtLog.info([
            '"try apply" :[',
            ...logList,
            ']',
        ].join('\n'));
    } else {
        fmtLog.info('"not any to apply" : [ ]');
    }

    return FormatCoreWrap(map);
}

export async function CmdFirstCommaStyleSwitch(
    AhkFileData: TAhkFileData,
    selection: vscode.Selection,
): Promise<void> {
    type TCommand = {
        select: 0 | 1,
        label: string,
    };

    const sate: TCommand | undefined = await vscode.window.showQuickPick<TCommand>([
        {
            select: 0,
            label: '1 -> try "Sleep, 1000" -> "Sleep 1000" ; (Remove first optional comma after command)',
        },
        {
            select: 1,
            label: '2 -> try "Sleep 1000" -> "Sleep, 1000" ; (add first optional comma after command)',
        },
    ]);

    if (sate === undefined) return;
    const t1: number = Date.now();

    const { select, label } = sate;
    fmtLog.info(label);

    const { DocStrMap, uri } = AhkFileData;
    const list: readonly TCmdSwitchComma[] = getCmdSwitchCommaList(DocStrMap, selection);

    const diffMap: TFmtCoreMap = select === 0
        ? RemoveFirstOptComma(list)
        : unRemoveFirstOptComma(list);

    const WorkspaceEdit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    const editList: vscode.TextEdit[] = applyVscodeEdit(diffMap);
    WorkspaceEdit.set(uri, editList);
    const ms: number = Date.now() - t1;

    await vscode.workspace.applyEdit(WorkspaceEdit);

    fmtLog.info(`ms : -> ${ms} , of label`);
    if (editList.length > 0) {
        fmtLog.show();
    }
}

/* eslint no-magic-numbers: ["error", { "ignore": [0,-1] }] */

import * as vscode from 'vscode';
import { getFormatConfig } from '../../configUI';
import { ErmFirstCommaCommand } from '../../configUI.data';

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function selectCmdTo1_or_2(): Promise<ErmFirstCommaCommand | null> {
    type TSelectTabOrSpace = {
        label: string,
        opt: ErmFirstCommaCommand,
        description: string,
    };
    const Preset: ErmFirstCommaCommand = getFormatConfig().removeFirstCommaCommand;
    if (Preset === ErmFirstCommaCommand.notFmt) {
        return ErmFirstCommaCommand.notFmt;
    }

    const description = '(your package settings)';
    const pick: TSelectTabOrSpace | undefined = await vscode.window.showQuickPick<TSelectTabOrSpace>([
        {
            label: '0 -> keep the status quo',
            opt: ErmFirstCommaCommand.notFmt,
            description: '',
        },
        {
            label: '1 -> `Sleep 1000` -> `Sleep, 1000`',
            opt: ErmFirstCommaCommand.to1,
            description: Preset === ErmFirstCommaCommand.to1
                ? description
                : '',
        },
        {
            label: '2 -> `Sleep, 1000` -> `Sleep 1000`',
            opt: ErmFirstCommaCommand.to2,
            description: Preset === ErmFirstCommaCommand.to2
                ? description
                : '',
        },
    ], {
        title: 'select command first optional comma style',
        placeHolder: 'AhkNekoHelp.format.removeFirstCommaCommand',
    });

    return pick === undefined
        ? null
        : pick.opt;
}

import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { CommandMDMap } from '../../../tools/Built-in/6_command/Command.tools';

export type TCmdSemantic = 0 | {
    nameUp: string,
    startLine: number,
    isFirstLine: boolean,
};

function getCmdData(AhkTokenLine: TAhkTokenLine): { nameUp: string, col: number } {
    const {
        fistWordUp,
        fistWordUpCol,
        SecondWordUp,
        SecondWordUpCol,
    } = AhkTokenLine;
    if (CommandMDMap.has(fistWordUp)) {
        return {
            nameUp: fistWordUp,
            col: fistWordUpCol,
        };
    }

    if (CommandMDMap.has(SecondWordUp)) {
        return {
            nameUp: SecondWordUp,
            col: SecondWordUpCol,
        };
    }

    return {
        nameUp: '',
        col: -1,
    };
}

export function getSemanticCmdShell(AhkFileData: TAhkFileData): readonly TCmdSemantic[] {
    const { DocStrMap } = AhkFileData;

    const result: TCmdSemantic[] = [];

    let lastCmd: TCmdSemantic = 0;
    for (const AhkTokenLine of DocStrMap) {
        const { cll, line } = AhkTokenLine;

        if (cll === 1) {
            if (lastCmd === 0) {
                result.push(0);
                continue;
            }

            result.push({
                ...lastCmd,
                isFirstLine: false,
            });
            continue;
        }

        const { nameUp, col } = getCmdData(AhkTokenLine);
        if (col === -1) {
            result.push(0);
            lastCmd = 0;
            continue;
        }

        const cmd: TCmdSemantic = {
            nameUp,
            startLine: line,
            isFirstLine: true,
        };
        lastCmd = cmd;
        result.push(cmd);
    }

    return result;
}

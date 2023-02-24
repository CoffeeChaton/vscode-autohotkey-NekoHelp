/* eslint-disable @fluffyfox/prefer-timer-id */
import * as vscode from 'vscode';
import { log } from '../provider/vscWindows/log';
import { statusBarItem } from '../provider/vscWindows/statusBarItem';
import {
    arrSum,
    avgMin5,
    stdDevFn,
    stdMin5,
} from './tools/myMath';
import type { TPickReturn } from './tools/pressureTestConfig';
import { pressureTestConfig } from './tools/pressureTestConfig';
import { UpdateCacheAsync } from './UpdateCache';

const DevModeData: number[] = [];

function devTestDA(cycles: number): void {
    const t1: number = Date.now();

    void UpdateCacheAsync(true)
        .then((): null => {
            DevModeData.push(Date.now() - t1);
            statusBarItem.text = `$(heart) ${DevModeData.length} of ${cycles}`;
            statusBarItem.show();
            return null;
        })
        .catch((error: Error): void => {
            log.error(error, 'devTestDA.error');
            log.show();
        });
}

function devTestEnd(cycles: number): void {
    const statistics: number[] = [...DevModeData];
    DevModeData.length = 0;

    const len: number = statistics.length;
    const sum: number = arrSum(statistics);
    const avg: number = sum / len;
    const stdDev: number = stdDevFn(statistics);
    const { subAvg, subAvgArr } = avgMin5(statistics);
    const { subStd, subStdArr } = stdMin5(statistics);

    log.info([
        '---------------------------------------------',
        'The task be completed, please confirm!',
        `resolve ${len} of ${cycles}`,
        `sum is ${sum}`,
        `avg is ${avg}`,
        `stdDev is ${stdDev}`,
        `[${statistics.join(', ')}]`,
        '---Min avg of 5 ---',
        `subAvg is ${subAvg}`, // sample standard avg
        `subAvgArr len is [${subAvgArr.join(', ')}]`,
        '---Min std of 5 ---',
        `subStd is ${subStd}`, // sample standard deviation
        `subStdArr len is [${subStdArr.join(', ')}]`,
        '---------------------------------------------',
    ].join('\n'));

    statusBarItem.text = '$(heart) dev task OK!';
    statusBarItem.show();

    log.show();
}

function validateInput(value: string): vscode.InputBoxValidationMessage | null {
    if ((/^[1-9]\d+/u).test(value)) {
        return null;
    }
    return {
        message: 'should input ms of > 10 integer, like 80 or 90',
        severity: vscode.InputBoxValidationSeverity.Error,
    };
}

const TimeoutList: NodeJS.Timeout[] = [];

export async function pressureTest(): Promise<null> {
    for (const timeout of TimeoutList) {
        clearInterval(timeout);
    }
    TimeoutList.length = 0;
    DevModeData.length = 0;

    const pick: TPickReturn | undefined = await pressureTestConfig();
    if (pick === undefined) return null;

    const msStr: string | undefined = await vscode.window.showInputBox({
        title: 'input delay ms of a cycles',
        prompt: 'Recommended reference of `Refresh Resource` * 1.5 ~ 2',
        placeHolder: '150',
        validateInput,
    });
    if (msStr === undefined) return null;

    const { cycles, label } = pick;

    log.info([
        '> "1 -> dev tools"',
        '>> this is Dev tools, open "vscode-js-profile-flame" to get ".cpuprofile"',
        `    please wait of [${label}]`,
    ].join('\n'));
    log.show();

    const delay: number = Number.parseInt(msStr, 10);
    for (let i = 1; i <= cycles; i++) {
        TimeoutList.push(setTimeout(devTestDA, i * delay, cycles));
    }

    // eslint-disable-next-line no-magic-numbers
    TimeoutList.push(setTimeout(devTestEnd, (cycles + 5) * delay, cycles));
    return null;
}

// The task be completed, please confirm!
// resolve 80 of 80
// sum is 6573
// avg is 82.1625
// stdDev is 5.775206172000611
// [128, 95, 89, 85, 85, 85, 86, 84, 83, 83, 83, 82, 82, 84, ...]
// ---Min avg of 5 ---
// subAvg is 79.2
// subAvgArr len is [80, 79, 79, 79, 79]
// ---Min std of 5 ---
// subStd is 0.4472135954999579
// subStdArr len is [80, 81, 80, 80, 80]
// ---------------------------------------------

// other perf
// Add an exclusion to Windows Security
// https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26
//
// Code Spell Checker

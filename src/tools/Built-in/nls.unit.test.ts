import { describe, expect, it } from '@jest/globals';
import * as fs from 'node:fs';
import path from 'node:path';
import { AVariablesList } from './1_built_in_var/A_Variables.data';
import { funcDataList } from './2_built_in_function/func.data';
import type { TSupportDoc } from './nls.tools';

const space = 4;
const mainPath: string = path.join(__dirname, '../../../ahk.json');
// console.log('mdPath', mainPath);

function fmtRawData(param: unknown): string {
    const obj = {
        headData: {
            note: 'machine generated, Please do not manually modify this file!',
            source: 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp',
        },
        body: param,
    };
    const data: string = JSON.stringify(obj, null, space);
    return data;
}

function makeEnJson(param: unknown, filename: string): void {
    const targetPath: string = path.join(mainPath, filename);
    const data: string = fmtRawData(param);
    fs.writeFileSync(targetPath, data);
}

function readJsonData(filename: string): string {
    const targetPath: string = path.join(mainPath, filename);
    try {
        const dataFromJson: string = fs.readFileSync(targetPath).toString();
        return dataFromJson;
    } catch {
        return '';
    }
}

function updateJson(param: unknown, filename: TSupportDoc): void {
    const file = `${filename}.en.ahk.json`;
    if (readJsonData(file) !== fmtRawData(param)) {
        makeEnJson(param, file);
    }
}

describe('generate .ahk.json', () => {
    it('generate: func.data.ts', () => {
        expect.hasAssertions();

        updateJson(funcDataList, 'func');
        updateJson(AVariablesList, 'A_Variables');

        expect(true).toBeTruthy();
    });
});

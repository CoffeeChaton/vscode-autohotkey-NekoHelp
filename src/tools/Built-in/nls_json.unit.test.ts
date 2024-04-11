import { describe, expect, it } from '@jest/globals';
import * as fs from 'node:fs';
import path from 'node:path';
import * as A_Variables_en from '../../../ahk.json/A_Variables.en.ahk.json';
import * as A_Variables_cn from '../../../ahk.json/A_Variables.zh-cn.ahk.json';
import * as BiVariables_en from '../../../ahk.json/BiVariables.en.ahk.json';
import * as BiVariables_cn from '../../../ahk.json/BiVariables.zh-cn.ahk.json';
import * as cmd_en from '../../../ahk.json/Command.en.ahk.json';
import * as cmd_cn from '../../../ahk.json/Command.zh-cn.ahk.json';
import * as Directives_en from '../../../ahk.json/Directives.en.ahk.json';
import * as Directives_cn from '../../../ahk.json/Directives.zh-cn.ahk.json';
import * as func_en from '../../../ahk.json/func.en.ahk.json';
import * as func_cn from '../../../ahk.json/func.zh-cn.ahk.json';

import { DirectivesList } from './0_directive/Directives.data';
import { AVariablesList } from './1_built_in_var/A_Variables.data';
import { BiVariables } from './1_built_in_var/BiVariables.data';
import { funcDataList } from './2_built_in_function/func.data';
import { LineCommand } from './6_command/Command.data';
import { type TSupportDoc } from './nls_json.tools';

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
    return JSON.stringify(obj, null, space);
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
        console.error('can\'t find .json');
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
    it('generate: updateJson', () => {
        expect.hasAssertions();

        updateJson(funcDataList, 'func');
        updateJson(AVariablesList, 'A_Variables');
        updateJson(BiVariables, 'BiVariables');
        updateJson(DirectivesList, 'Directives');
        updateJson(LineCommand, 'Command');

        expect(true).toBeTruthy();
    });

    it('generate: check zh-cn like en', () => {
        expect.hasAssertions();

        interface TV {
            keyRawName: string;
            doc: string[];
        }
        interface TK {
            body: TV[];
        }
        const fn = (k: TK): string[] => k.body.map(({ keyRawName }: TV): string => keyRawName);

        expect(fn(A_Variables_en)).toStrictEqual(fn(A_Variables_cn));
        expect(fn(BiVariables_en)).toStrictEqual(fn(BiVariables_cn));
        expect(fn(cmd_en)).toStrictEqual(fn(cmd_cn));
        expect(fn(Directives_en)).toStrictEqual(fn(Directives_cn));
        expect(fn(func_en)).toStrictEqual(fn(func_cn));
    });
});

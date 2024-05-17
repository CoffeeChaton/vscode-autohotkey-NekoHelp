/* eslint-disable jest/max-expects */
import {
    describe,
    expect,
    it,
} from '@jest/globals';
import * as fs from 'node:fs';
import path from 'node:path';
import * as A_Variables_en from '../../../doc/A_Variables.en.ahk.json';
import * as A_Variables_cn from '../../../doc/A_Variables.zh-cn.ahk.json';
import * as Ahk2exeData_en from '../../../doc/Ahk2exeData.en.ahk.json';
import * as Ahk2exeData_cn from '../../../doc/Ahk2exeData.zh-cn.ahk.json';
import * as BiVariables_en from '../../../doc/BiVariables.en.ahk.json';
import * as BiVariables_cn from '../../../doc/BiVariables.zh-cn.ahk.json';
import * as cmd_en from '../../../doc/Command.en.ahk.json';
import * as cmd_cn from '../../../doc/Command.zh-cn.ahk.json';
import * as Directives_en from '../../../doc/Directives.en.ahk.json';
import * as Directives_cn from '../../../doc/Directives.zh-cn.ahk.json';
import * as foc_en from '../../../doc/foc.en.ahk.json';
import * as foc_cn from '../../../doc/foc.zh-cn.ahk.json';
import * as focEx_en from '../../../doc/focEx.en.ahk.json';
import * as focEx_cn from '../../../doc/focEx.zh-cn.ahk.json';
import * as func_en from '../../../doc/func.en.ahk.json';
import * as func_cn from '../../../doc/func.zh-cn.ahk.json';
import { DirectivesList } from './0_directive/Directives.data';
import { AVariablesList } from './1_built_in_var/A_Variables.data';
import { BiVariables } from './1_built_in_var/BiVariables.data';
import { funcDataList } from './2_built_in_function/func.data';
import { Statement } from './3_foc/foc.data';
import { focExDataList } from './3_foc/focEx.data';
import { LineCommand } from './6_command/Command.data';
import { Ahk2exeData } from './99_Ahk2Exe_compiler/Ahk2exe.data';
import { type TSupportDoc } from './nls_json.tools';

const space = 4;
const mainPath: string = path.join(__dirname, '../../../doc');
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

function checkIsJustEn(param: unknown): string {
    const fullText: string = fmtRawData(param);
    const textList: string[] = fullText.split('\n');
    for (const text of textList) {
        // eslint-disable-next-line no-control-regex, sonarjs/no-collapsible-if
        if ((/[^\u0000-\u007F]/u).test(text)) {
            // eslint-disable-next-line unicorn/no-lonely-if
            if (!(/[^△↑→↓←]/u).test(text)) return text;
        }
    }
    return '';
}

describe('generate .ahk.json', () => {
    it('generate: check zh-cn structure like en', () => {
        expect.hasAssertions();

        updateJson(funcDataList, 'func');
        updateJson(AVariablesList, 'A_Variables');
        updateJson(BiVariables, 'BiVariables');
        updateJson(DirectivesList, 'Directives');
        updateJson(LineCommand, 'Command');
        updateJson(Statement, 'foc');
        updateJson(focExDataList, 'focEx');
        updateJson(Ahk2exeData, 'Ahk2exeData');

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
        expect(fn(foc_en)).toStrictEqual(fn(foc_cn));
        expect(fn(focEx_en)).toStrictEqual(fn(focEx_cn));
        expect(fn(Ahk2exeData_en)).toStrictEqual(fn(Ahk2exeData_cn));
    });

    it('confirmed as pure English', () => {
        expect.hasAssertions();
        //

        expect(checkIsJustEn(funcDataList)).toBe('');
        expect(checkIsJustEn(AVariablesList)).toBe('');
        expect(checkIsJustEn(BiVariables)).toBe('');
        expect(checkIsJustEn(DirectivesList)).toBe('');
        expect(checkIsJustEn(LineCommand)).toBe('');
        expect(checkIsJustEn(Statement)).toBe('');
        expect(checkIsJustEn(focExDataList)).toBe('');
        expect(checkIsJustEn(Ahk2exeData)).toBe('');
    });
});

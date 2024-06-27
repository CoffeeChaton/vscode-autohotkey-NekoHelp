/* eslint-disable jest/max-expects */
import {
    describe,
    expect,
    it,
} from '@jest/globals';
import * as fs from 'node:fs';
import path from 'node:path';

import { DirectivesList } from './0_directive/Directives.data';
import { AVariablesList } from './1_built_in_var/A_Variables.data';
import { BiVariables } from './1_built_in_var/BiVariables.data';
import { funcDataList } from './2_built_in_function/func.data';
import { Statement } from './3_foc/foc.data';
import { focExDataList } from './3_foc/focEx.data';
import { LineCommand } from './6_command/Command.data';
import { ObjBase } from './8_built_in_method_property/ObjBase.data';
import { ObjException } from './8_built_in_method_property/ObjException.data';
import { ObjFile } from './8_built_in_method_property/ObjFile.data';
import { ObjFunc } from './8_built_in_method_property/ObjFunc.data';
import { ObjInputHook } from './8_built_in_method_property/ObjInputHook.data';
import { Ahk2exeData } from './99_Ahk2Exe_compiler/Ahk2exe.data';
import { type TSupportDoc } from './nls_json.tools';

interface TV {
    keyRawName: string;
    doc: readonly string[];
}

const space = 4;
const mainPath: string = path.join(__dirname, '../../../doc');
// console.log('mdPath', mainPath);

function fmtRawData(param: unknown): string {
    const obj = {
        headData: {
            note: 'machine generated, Please do not manually modify this file!',
            source: 'https://www.autohotkey.com/docs/v1/',
            'Adjust some formats to suit vscode display': 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp',
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

function updateJson(param: readonly TV[], filename: TSupportDoc): void {
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

        updateJson(ObjBase, 'ObjBase');
        updateJson(ObjException, 'ObjException');
        updateJson(ObjFile, 'ObjFile');
        updateJson(ObjFunc, 'ObjFunc');
        updateJson(ObjInputHook, 'ObjInputHook');

        type TNlsFile = {
            name: string,
            fullPath: string,
        };
        const allEn: TNlsFile[] = [];
        const allCn: TNlsFile[] = [];
        const files: string[] = fs.readdirSync(mainPath);
        for (const file of files) {
            if (!file.endsWith('.json')) continue;
            const name = file.replace(/\..*/u, '');
            const fullPath: string = mainPath + path.sep + file;
            if (file.endsWith('.zh-cn.ahk.json')) {
                allCn.push({ name, fullPath });
            } else {
                allEn.push({ name, fullPath });
            }
        }

        expect(allEn).toHaveLength(allCn.length);
        expect(allEn.map((v: TNlsFile): string => v.name)).toStrictEqual(allCn.map((v: TNlsFile): string => v.name));

        interface TK {
            body: TV[];
        }

        const fn = (k: TK): string[] => k.body.map(({ keyRawName }: TV): string => keyRawName);
        const fn_json2data = (fullPath: string): TK => JSON.parse(fs.readFileSync(fullPath).toString()) as TK;

        for (const [i, en] of allEn.entries()) {
            const enJson: TK = fn_json2data(en.fullPath);
            const cnJson: TK = fn_json2data(allCn[i].fullPath);

            expect(fn(enJson)).toStrictEqual(fn(cnJson));
        }
        //
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

        expect(checkIsJustEn(ObjBase)).toBe('');
        expect(checkIsJustEn(ObjException)).toBe('');
        expect(checkIsJustEn(ObjFile)).toBe('');
        expect(checkIsJustEn(ObjFunc)).toBe('');
        expect(checkIsJustEn(ObjInputHook)).toBe('');
    });
});

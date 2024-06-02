/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */
import { describe, expect, it } from '@jest/globals';
import { ObjBase } from './ObjBase.data';
import { ObjFile } from './ObjFile.data';
import { ObjFunc } from './ObjFunc.data';
import { ObjInputHook } from './ObjInputHook.data';

describe('check ahk-Object ruler', () => {
    it('check ObjBase', () => {
        expect.hasAssertions();

        const errList: [ID: string, value: string][] = [];
        for (const v of ObjBase) {
            const {
                keyRawName,
                insert,
                uri,
            } = v;

            const isMethod: boolean = keyRawName.includes('(');
            const key: string = isMethod
                ? keyRawName.replace('()', '')
                : keyRawName;
            const v1: boolean = uri === `https://www.autohotkey.com/docs/v1/lib/Object.htm#${key}`;
            if (!v1) {
                errList.push([keyRawName, uri]);
            }

            const v2: boolean = isMethod
                ? insert.startsWith(`${key}(`)
                : insert === key;
            if (!v2) {
                errList.push([keyRawName, insert]);
            }
        }

        expect(errList).toStrictEqual(
            [
                ['MinIndex()', 'https://www.autohotkey.com/docs/v1/lib/Object.htm#MinMaxIndex'],
                ['MaxIndex()', 'https://www.autohotkey.com/docs/v1/lib/Object.htm#MinMaxIndex'],
                ['_NewEnum()', 'https://www.autohotkey.com/docs/v1/lib/Object.htm#NewEnum'],
            ],
        );
    });

    it('check ObjFile', () => {
        expect.hasAssertions();

        const errList: [ID: string, value: string][] = [];
        for (const v of ObjFile) {
            const {
                keyRawName,
                insert,
                uri,
            } = v;

            const isMethod: boolean = keyRawName.includes('(');
            const key: string = isMethod
                ? keyRawName.replace('()', '')
                : keyRawName;
            const v1: boolean = uri === `https://www.autohotkey.com/docs/v1/lib/File.htm#${key}`;
            if (!v1) {
                errList.push([keyRawName, uri]);
            }

            const v2: boolean = isMethod
                ? insert.startsWith(`${key}(`)
                : insert === key;
            if (!v2) {
                errList.push([keyRawName, insert]);
            }
        }

        expect(errList).toStrictEqual(
            [
                ['Position', 'https://www.autohotkey.com/docs/v1/lib/File.htm#Pos'],
                ['__Handle', 'https://www.autohotkey.com/docs/v1/lib/File.htm#Handle'],
                ['ReadUInt()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum'],
                ['ReadInt()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum'],
                ['ReadInt64()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum'],
                ['ReadShort()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum'],
                ['ReadUShort()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum'],
                ['ReadChar()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum'],
                ['ReadUChar()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum'],
                ['ReadDouble()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum'],
                ['ReadFloat()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#ReadNum'],
                ['WriteUInt()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum'],
                ['WriteInt()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum'],
                ['WriteInt64()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum'],
                ['WriteShort()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum'],
                ['WriteUShort()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum'],
                ['WriteChar()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum'],
                ['WriteUChar()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum'],
                ['WriteDouble()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum'],
                ['WriteFloat()', 'https://www.autohotkey.com/docs/v1/lib/File.htm#WriteNum'],
            ],
        );
    });

    it('check ObjFunc', () => {
        expect.hasAssertions();

        const errList: [ID: string, value: string][] = [];
        for (const v of ObjFunc) {
            const {
                keyRawName,
                uri,
                exp,
            } = v;

            const isMethod: boolean = keyRawName.includes('(');
            const key: string = isMethod
                ? keyRawName.replace('()', '')
                : keyRawName;
            const v1: boolean = uri === `https://www.autohotkey.com/docs/v1/lib/Func.htm#${key}`;
            if (!v1) {
                errList.push([keyRawName, uri]);
            }

            const searchKey: string = isMethod
                ? keyRawName.replace(')', '')
                : keyRawName;
            const v2: boolean = exp.join('\n').includes(`.${searchKey}`);
            if (!v2) {
                errList.push([keyRawName, keyRawName]);
            }
        }

        expect(errList).toStrictEqual([]);
    });

    it('check ObjInputHook', () => {
        expect.hasAssertions();

        const errList: [ID: string, value: string][] = [];
        for (const v of ObjInputHook) {
            const {
                exp,
                insert,
                keyRawName,
                uri,
            } = v;

            const isMethod: boolean = keyRawName.includes('(');
            const key: string = isMethod
                ? keyRawName.replace('()', '')
                : keyRawName;
            if (uri !== `https://www.autohotkey.com/docs/v1/lib/InputHook.htm#${key}`) {
                errList.push([keyRawName, uri]);
            }

            const searchKey: string = isMethod
                ? keyRawName.replace(')', '')
                : keyRawName;
            const v2: boolean = exp.join('\n').includes(`.${searchKey}`);
            if (!v2) {
                errList.push([keyRawName, keyRawName]);
            }

            if (!insert.startsWith(insert)) {
                errList.push([keyRawName, insert]);
            }
        }

        expect(errList).toStrictEqual([]);
    });
});

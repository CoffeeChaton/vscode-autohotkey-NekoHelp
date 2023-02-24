import { pm } from '../../core/ProjectManager';
import type { TTreeResult } from '../ListIncludeTree';

/**
 * key : fsPath
 * value : hint
 */
type TValue = {
    hint: number,
    dataList: TTreeResult[],
};

function initializeDiagIncludeTreeMap(result: TTreeResult[]): ReadonlyMap<string, TValue> {
    const hintMap = new Map<string, TValue>();

    for (const fsPath of pm.DocMap.keys()) {
        hintMap.set(fsPath, {
            hint: 0,
            dataList: [],
        });
    }

    for (const data of result) {
        const { searchPath } = data;
        const oldValue: TValue | undefined = hintMap.get(searchPath);
        if (oldValue === undefined) {
            hintMap.set(searchPath, {
                hint: 0,
                dataList: [],
            });
        } else {
            oldValue.hint += 1;
            oldValue.dataList.push(data);
            hintMap.set(searchPath, oldValue);
        }
    }

    return hintMap;
}

function hint0Msg(hint0: string[]): string[] {
    const msg: string[] = [];
    msg.push(
        '[hint = 0] some file not "include" or not use "#Include"',
        '    just support explicit use "#Include"',
        '    not  support implicit now ;https://www.autohotkey.com/docs/v1/Functions.htm#lib',
        '',
    );
    for (const fsPath of hint0) {
        msg.push(`   0 -> ${fsPath}`);
    }
    return msg;
}

function hint2MoreMsg(hintMap: ReadonlyMap<string, TValue>): string[] {
    const msg: string[] = [];
    msg.push(
        '[hint > 1]',
        '    "#Include" vs "#IncludeAgain" ; https://www.autohotkey.com/docs/v1/lib/_Include.htm#Remarks',
        '    "#Include" ensures that FileName is included only once, even if multiple inclusions are encountered for it.',
        '    By contrast, #IncludeAgain allows multiple inclusions of the same file, while being the same as #Include in all other respects.',
        '',
    );

    for (const [fsPath, v] of hintMap) {
        if (v.hint <= 1) continue;

        const startPos0: string = v.dataList[0].startPos;
        const showMsg: boolean = v.dataList.some((pos: TTreeResult): boolean => pos.startPos !== startPos0);

        if (!showMsg) continue;

        msg.push(`    ${v.hint} -> ${fsPath}`);
        for (const { name, startPos } of v.dataList) {
            msg.push(`        ${name} ; ${startPos}`);
        }
    }
    return msg;
}

export function diagOfIncludeTree(result: TTreeResult[], selectPath: string): string[] {
    const hintMap: ReadonlyMap<string, TValue> = initializeDiagIncludeTreeMap(result);
    const hint0: string[] = [];
    for (const [fsPath, v] of hintMap) {
        if (v.hint === 0 && fsPath !== selectPath) {
            hint0.push(fsPath);
        }
    }

    let hintN = 0;
    for (const v of hintMap.values()) {
        if (v.hint > 1) hintN++;
    }

    if (hint0.length === 0 && hintN === 0) {
        return [];
    }

    const msg: string[] = [
        ';----------------------------------------',
        '> "List All #Include Tree" Report',
    ];

    if (hint0.length > 0) {
        msg.push(...hint0Msg(hint0));
    }

    if (hintN > 0) {
        msg.push(...hint2MoreMsg(hintMap));
    }

    //
    return msg;
}

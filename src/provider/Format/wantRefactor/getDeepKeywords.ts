/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,4,-999] }] */
/* eslint-disable max-lines-per-function */
import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';
import type { TBrackets } from '../../../tools/Bracket';
import { FocIfExMap } from '../../../tools/Built-in/3_foc/semanticFoc.data';

/**
 * from src/tools/Built-in/statement.data.ts
 */
const focSet: ReadonlySet<string> = new Set(
    [
        // --

        'Catch',
        'else',
        'Finally',
        'for',
        //
        'if',
        'IfEqual',
        'IfExist',
        'IfGreater',
        'IfGreaterOrEqual',
        'IfInString',
        'IfLess',
        'IfLessOrEqual',
        'IfMsgBox',
        'IfNotEqual',
        'IfNotExist',
        'IfNotInString',
        'IfWinActive',
        'IfWinExist',
        'IfWinNotActive',
        'IfWinNotExist',
        //
        'loop',
        'try',
        'while',
    ].map((s: string): string => s.toUpperCase()),
);

type TLockObj = {
    lockDeep: number,
    lockOcc: number,
};

export type TLnStatus = {
    isHotFix22: boolean, // https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp-Old/issues/22
    lockList: readonly TLockObj[],
    occ: number,
    status: string,
};

function addLock({ lnStatus, AhkTokenLine }: {
    AhkTokenLine: TAhkTokenLine,
    lnStatus: TLnStatus,
}): TLnStatus {
    const { occ, lockList } = lnStatus;
    const lockOcc: number = occ;
    const lockDeep: number = AhkTokenLine.deep2.at(-1) ?? 0;

    return {
        isHotFix22: false,
        lockList: [...lockList, { lockOcc, lockDeep }],
        occ,
        status: 'add lock',
    };
}

function focOccDiff({ lnStatus, AhkTokenLine }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    lnStatus: TLnStatus,
}): TLnStatus {
    const { occ, lockList } = lnStatus;

    if (occ === 0) { // happy path
        return {
            isHotFix22: false,
            lockList: [],
            occ: 0,
            status: 'old occ is 0',
        };
    }

    const tempLockList: TLockObj[] = [...lockList];
    const checkList: TLockObj[] = [...lockList];
    let lastLock: TLockObj | undefined = tempLockList.pop();
    if (lastLock === undefined) {
        lastLock = { lockDeep: 0, lockOcc: 0 };
        checkList.push({ lockDeep: 0, lockOcc: 0 });
    }

    const { line, deep2 } = AhkTokenLine;
    const thisLineDeep = deep2.at(-1) ?? 0;
    for (const { lockDeep, lockOcc } of checkList) {
        if (lockDeep === thisLineDeep) {
            let newOcc = occ - 1;
            if (newOcc < lockOcc) {
                newOcc = lockOcc;
                tempLockList.push(lastLock);
                return {
                    isHotFix22: false,
                    lockList: tempLockList,
                    occ: lockOcc,
                    status: `occ-- case--110- ln ${line} (trigger lock protection)`,
                };
            }

            let bgb = lockOcc;
            if (lockOcc === 0) {
                bgb = occ > 0
                    ? occ - 1
                    : 0;
            } else {
                tempLockList.push(lastLock);
            }

            return {
                isHotFix22: false,
                lockList: tempLockList,
                occ: bgb,
                status: `occ-- case--126-- ln ${line}`,
            };
        }
    }

    const { lockDeep, lockOcc } = lastLock;

    if (thisLineDeep < lockDeep) {
        const newOcc = occ > 0
            ? occ - 1
            : 0;

        return {
            isHotFix22: false,
            lockList: [...tempLockList],
            occ: newOcc,
            status: `occ-- case--141--at deep < lockDeep -- ln ${line}`,
        };
    }

    let newOcc: number = occ - 1;
    if (newOcc < lockOcc) {
        newOcc = lockOcc;
        tempLockList.push(lastLock);
        return {
            isHotFix22: false,
            lockList: tempLockList,
            occ: lockOcc,
            status: `occ-- case--157-- ln ${line} (trigger lock protection)`,
        };
    }

    if (lockOcc !== 0) {
        tempLockList.push(lastLock);
    }

    return {
        isHotFix22: false,
        lockList: tempLockList,
        occ: lockOcc,
        status: `occ-- case--168-- ln ${line}`,
    };
}

function forIfCase({ AhkTokenLine, matrixBrackets, lnStatus }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    lnStatus: TLnStatus,
}): TLnStatus {
    const { line } = AhkTokenLine;
    const { occ, lockList } = lnStatus;

    /**
     * if (a ; <---------not close
     *  + b
     *  + c)
     *
     * or
     *
     * if fnCall(a ; <---------not close
     *    ,b
     *    ,c)
     */
    if (matrixBrackets[line + 1][2] > 0) {
        return {
            isHotFix22: false,
            lockList: [...lockList],
            occ,
            status: `if ( ,not close at ln ${line}`,
            // TODO
            // if (a
            // + b > 0)
            //     MsgBox , with out `{`
        };
    }

    /**
     * 99% case
     * if (a ); <---------close
     *
     * or
     * oldIf case
     */
    return {
        isHotFix22: false,
        lockList: [...lockList],
        occ: occ + 1,
        status: 'if () case',
    };
}

function focElseFinallyCase({ AhkTokenLine, matrixBrackets, lnStatus }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    lnStatus: TLnStatus,
}): TLnStatus {
    const { lStr, fistWordUpCol, fistWordUp } = AhkTokenLine;

    /**
     * 1. end if     -> forIfCase
     * 2. else return
     * 3. else foo()
     */
    const afterElseStr = lStr.slice(fistWordUpCol + fistWordUp.length)
        .replace(/^\s*,/u, '') // fix ----> "else," WTF?
        .trim();
    if (afterElseStr.length > 0) {
        // check start with 'if' case
        if ((/^if(?:\s|\()/iu).test(afterElseStr)) {
            return forIfCase({ AhkTokenLine, matrixBrackets, lnStatus });
        }
        return focOccDiff({ AhkTokenLine, matrixBrackets, lnStatus });
    }

    /**
     * else ;nothings <--- after else not any string
     */
    const { occ, lockList } = lnStatus;
    return {
        isHotFix22: false,
        lockList: [...lockList],
        occ: occ + 1,
        status: 'else end with spec',
    };
}

export function getDeepKeywords({
    lStrTrim,
    lnStatus,
    AhkTokenLine,
    matrixBrackets,
    DocStrMap,
}: {
    lStrTrim: string,
    lnStatus: TLnStatus,
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    DocStrMap: TTokenStream,
}): TLnStatus {
    const {
        occ,
        lockList,
        isHotFix22,
    } = lnStatus;
    const { fistWordUp, line, SecondWordUpCol } = AhkTokenLine;
    if (isHotFix22) {
        return addLock({ lnStatus, AhkTokenLine });
    } // FIXME: if this line is `{ if` case

    if (focSet.has(fistWordUp)) {
        if (lStrTrim.endsWith('{')) return addLock({ lnStatus, AhkTokenLine }); // managed by curly braces
        const nextLine: TAhkTokenLine | undefined = DocStrMap.at(line + 1);
        if (nextLine === undefined) {
            return {
                isHotFix22: false,
                lockList: [],
                occ: 0,
                status: 'end of file',
            };
        }
        if (nextLine.lStr.trim().startsWith('{')) {
            return {
                isHotFix22: true, // <---------only this is true
                lockList,
                occ,
                status: ' EFmtMagicStr.caseA',
            };
        } // managed by curly braces

        if (fistWordUp === 'IF') return forIfCase({ AhkTokenLine, matrixBrackets, lnStatus });

        if (fistWordUp === 'ELSE' || fistWordUp === 'TRY' || fistWordUp === 'FINALLY') {
            return focElseFinallyCase({ AhkTokenLine, matrixBrackets, lnStatus });
        }

        if (FocIfExMap.has(fistWordUp) && SecondWordUpCol !== -1) {
            return focOccDiff({ AhkTokenLine, matrixBrackets, lnStatus });
        }
        // other key word
        return {
            isHotFix22: false,
            lockList: [...lockList],
            occ: occ + 1,
            status: `other key word+ "${fistWordUp}"`,
        };
    }

    const nextLine: TAhkTokenLine | undefined = DocStrMap.at(line + 1);
    if (nextLine === undefined) {
        return {
            isHotFix22: false,
            lockList: [],
            occ: 0,
            status: 'end of file part2',
        };
    }
    if (nextLine.multilineFlag !== null) {
        return {
            isHotFix22: false,
            lockList: [...lockList],
            occ,
            status: 'managed by multiline',
        }; // managed by multiline
    }

    const { cll } = AhkTokenLine;
    if (cll === 1) {
        const { multiline } = AhkTokenLine;
        if (multiline === EMultiline.end) {
            return focOccDiff({ AhkTokenLine, matrixBrackets, lnStatus });
        }
        return {
            isHotFix22: false,
            lockList: [...lockList],
            occ,
            status: 'managed by cll',
        };
    }

    return focOccDiff({ AhkTokenLine, matrixBrackets, lnStatus });
}

/**
 * This state machine is so complex that I think it was written by coincidence and monkey patching.
 * Before I create a good enough test collection,
 * I will not fix the scaling problem for the time being and try to keep the same snapshot as my private repository,
 * I need time to clarify and reconstruct this module.
 *
 * - #1 rollback_node
 * > * feat: fix fmt with *Crazy monkey patch v1* <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/commit/ec67a578c8cbf1eba5b8e1f6cacedfdf8ec9bba1>
 */

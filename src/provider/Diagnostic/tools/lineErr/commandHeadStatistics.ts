import { log } from '../../../vscWindows/log';

const DEB = new Map<string, number>();

const isDebug = false;

// not export now
// eslint-disable-next-line @typescript-eslint/naming-convention
function _commandHeadStatistics(commandHead: string): void {
    const hint: number = DEB.get(commandHead) ?? 0;
    DEB.set(commandHead, hint + 1);

    // for debug
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (isDebug) {
        type TElement = {
            k: string,
            v: number,
        };
        const e5: TElement[] = [];
        for (const [k, v] of DEB) {
            // eslint-disable-next-line no-magic-numbers
            if (v > 10) {
                e5.push({ k, v });
            }
        }

        e5.sort((a: TElement, b: TElement): number => a.v - b.v);

        log.info(
            e5.map(({ k, v }: TElement): string => `${k}: ${v}`)
                .join('\n'),
        );
        log.show();
    }
}

// SWITCH: 37
// DEFAULT: 37
// SEND: 46
// FOR: 58
// LISTVARS: 59
// GLOBAL: 93
// LOCAL: 118
// SLEEP: 132
// CASE: 134
// ELSE: 168
// STATIC: 230
// IF: 771
// RETURN: 903

import { log } from '../provider/vscWindows/log';

export function enumLog(params: never, fnName: string): void {
    log.error(fnName, 'enumLog ~ params');
    log.show();
    throw new Error(`enumLog - ${fnName}`);
}

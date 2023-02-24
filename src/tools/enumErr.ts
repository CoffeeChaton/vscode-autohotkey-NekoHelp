import { log } from '../provider/vscWindows/log';

export class CEnumError extends Error {
    public constructor(fnName: string) {
        super(`enumLog - ${fnName}`);

        this.name = 'CEnumError';
    }
}

export function enumLog(params: never, fnName: string): void {
    log.error(fnName, 'enumLog ~ params');
    log.show();
    throw new CEnumError(fnName);
}

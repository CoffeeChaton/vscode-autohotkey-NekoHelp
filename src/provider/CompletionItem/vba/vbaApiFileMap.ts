import * as fs from 'node:fs';
import path from 'node:path';

export const vbaApiFileMap: ReadonlyMap<string, string> = ((): ReadonlyMap<string, string> => {
    const vbaRootDir: string = path.resolve(__dirname, '../data/vba-api');
    const files: string[] = fs.readdirSync(vbaRootDir);
    const upMap = new Map<string, string>();
    for (const file of files) {
        if (file.endsWith('.json')) {
            upMap.set(
                file.replace('.json', '').toUpperCase(),
                path.resolve(vbaRootDir, file),
            );
        }
    }

    return upMap;
})();

/* eslint-disable no-mixed-operators */
import * as fs from 'node:fs';
import * as path from 'node:path';

export function mkDirByPathSync(targetDir: string /* { isRelativeToScript = false } = {} */): string {
    const { sep } = path;
    const initDir = path.isAbsolute(targetDir)
        ? sep
        : '';
    // const baseDir: string = isRelativeToScript
    //     ? __dirname
    //     : '.';
    const baseDir = '.';

    // eslint-disable-next-line unicorn/no-array-reduce
    return targetDir.split(sep).reduce((parentDir: string, childDir: string): string => {
        const curDir: string = path.resolve(baseDir, parentDir, childDir);
        try {
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            fs.mkdirSync(curDir);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const code: string = error.code as string;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (code === 'EEXIST') { // curDir already exists!
                return curDir;
            }

            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                // eslint-disable-next-line @fluffyfox/no-default-error
                throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
            }

            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].includes(code);
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                throw error; // Throw if it's just the last created dir.
            }
        }

        return curDir;
    }, initDir);
}

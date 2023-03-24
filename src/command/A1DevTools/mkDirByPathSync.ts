import * as fs from 'node:fs';
import * as path from 'node:path';

export function mkDirByPathSync(targetDir: string): string {
    const { sep } = path;
    const normalize: string = path.normalize(targetDir);
    const { root } = path.parse(normalize);
    const dirs: readonly string[] = normalize.replace(root, '').split(sep);

    let currentDir: string = root;
    for (const dir of dirs) {
        currentDir = path.join(currentDir, dir);
        try {
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            fs.mkdirSync(currentDir);
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const code: string = error.code as string;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (code === 'EEXIST') {
                continue;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                // eslint-disable-next-line @fluffyfox/no-default-error
                throw new Error(`EACCES: permission denied, mkdir :'${currentDir}'`, { cause: error });
            }

            // eslint-disable-next-line @fluffyfox/no-default-error
            throw new Error(`Failed to create directory. mkdir: "${currentDir}"`, { cause: error });
        }
    }

    return currentDir;
}

/* eslint-disable security/detect-non-literal-fs-filename */
import Mocha from 'mocha';
import * as fs from 'node:fs';
import * as path from 'node:path';

type TFsPath = string;
function getTestFsPath(fsPath: TFsPath, Collector: Set<TFsPath>): void {
    const Stats: fs.Stats = fs.statSync(fsPath);
    if (Stats.isDirectory()) {
        const files: string[] = fs.readdirSync(fsPath);
        for (const file of files) {
            const fsPathNext: TFsPath = path.resolve(fsPath, file); // `${fsPath}/${file}`;
            getTestFsPath(fsPathNext, Collector);
        }
    } else if (Stats.isFile() && fsPath.endsWith('.global.test.js')) {
        Collector.add(fsPath);
    }
}

export function run(testsRoot: string, cb: (error: unknown, failures?: number) => void): void {
    // const testsRoot = path.resolve(__dirname, '..');

    // Create the mocha test
    // console.log('🚀 ~ run ~ testsRoot', testsRoot);

    const Collector = new Set<TFsPath>();
    getTestFsPath(path.resolve(testsRoot, '../../../'), Collector);
    // console.log('🚀 ~ Collector', [...Collector]);

    // Create the mocha test
    const mocha = new Mocha({
        ui: 'tdd',
    });
    for (const f of Collector) mocha.addFile(path.resolve(testsRoot, f));

    console.log('🚀 ~ run ~ cb', cb);
    try {
        // Run the mocha test
        mocha.run((failures: number): void => {
            cb(null, failures);
        });
    } catch (error) {
        cb(error);
    }
}

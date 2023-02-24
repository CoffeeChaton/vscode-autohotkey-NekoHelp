/* eslint-disable unicorn/prefer-module */
import { runTests } from '@vscode/test-electron';
import * as path from 'node:path';

function main(): void {
    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = path.dirname(fileURLToPath(import.meta.url));

    runTests({
        launchArgs: ['--disable-extensions'],
        extensionDevelopmentPath: path.resolve(__dirname, '../../'),
        extensionTestsPath: path.resolve(__dirname, './suite/index'),
    })
        .catch((error: unknown): void => {
            console.error('Failed to run tests');
            let message = 'Unknown Error';
            if (error instanceof Error) {
                message = error.message;
            }
            console.error(error);
            console.log('🚀 ~ main ~ message', message);
        });
}

main();

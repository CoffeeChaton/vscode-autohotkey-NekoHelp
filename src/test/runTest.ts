/* eslint-disable unicorn/no-process-exit */
import { runTests } from '@vscode/test-electron';
import * as path from 'node:path';

async function go(): Promise<void> {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');
        const extensionTestsPath = path.resolve(__dirname, './suite');
        // console.warn({
        //     extensionDevelopmentPath,
        //     extensionTestsPath,
        // });

        await runTests({
            //   version: 'insiders',
            extensionDevelopmentPath,
            extensionTestsPath,
        });
    } catch (error: unknown) {
        console.error('Failed to run tests');

        let message = 'Unknown Error';
        if (error instanceof Error) {
            message = error.message;
        }
        console.error(error);
        console.log('🚀 ~ main ~ message', message);
        process.exit(1);
    }
}

void go();

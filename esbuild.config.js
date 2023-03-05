'use strict';

const esbuild = require('esbuild');
const args = process.argv.slice(2);

if (args.includes('--isTest')) {
    const fs = require('node:fs');
    const path = require('node:path');

    function getTestFsPath(fsPath, Collector) {
        const Stats = fs.statSync(fsPath);
        if (Stats.isDirectory()) {
            const files = fs.readdirSync(fsPath);
            for (const file of files) {
                const fsPathNext = `${fsPath}/${file}`; // `${fsPath}/${file}`;
                getTestFsPath(fsPathNext, Collector);
            }
        } else if (Stats.isFile() && fsPath.endsWith('.global.test.ts')) {
            Collector.add(fsPath);
        }
    }

    const rootPath = path.resolve(__dirname, './src').replaceAll(/\\/gu, '/');
    const Collector = new Set();
    getTestFsPath(rootPath, Collector);
    const list = [...Collector];//.map((fsPtah) => fsPtah.replaceAll(/\\/gu, '/'));
    // console.warn({ rootPath, list })

    esbuild
        .build({
            bundle: true,
            entryPoints: ['./src/test/runTest.ts', './src/test/suite/index.ts', ...list],
            external: ['vscode', '@vscode/test-electron'], // not bundle 'vscode' && https://github.com/modfy/nominal
            format: 'cjs',
            logLevel: 'error',
            minify: false,
            outdir: 'dist_test',
            platform: 'node',
            sourcemap: true,
            target: ['es2022', 'node16.14'],
            treeShaking: true,
        })
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
} else {
    const isDev = args.includes('--isDev');
    esbuild
        .build({
            // define:DEBUG=false
            // entryNames: '[dir]/neko',
            // keepNames: true,
            // mainFields: ['module', 'main'],
            // splitting: true,
            // tsconfig
            // watch: false,
            bundle: true,
            entryPoints: ['./src/extension.ts'],
            external: ['vscode'], // not bundle 'vscode' && https://github.com/modfy/nominal
            format: 'cjs',
            logLevel: 'info',
            minify: false,
            outdir: 'dist',
            platform: 'node',
            sourcemap: isDev,
            target: ['es2022', 'node16.14'],
            treeShaking: true,
        })
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

'use strict';

const esbuild = require('esbuild');
const args = process.argv.slice(2);
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
        entryPoints: ['./src/extension.ts', './src/test/runTest.ts', './src/test/suite/index.ts'],
        external: ['vscode', '@vscode/test-electron'], // not bundle 'vscode' && https://github.com/modfy/nominal
        format: 'cjs',
        logLevel: 'info',
        minify: false, // 130KB -> 150KB, but a picture usually has 10~20 kb
        outdir: 'dist',
        platform: 'node',
        sourcemap: isDev,
        target: ['es2022', 'node16.14'],
        treeShaking: true,
    })
    .then(() => process.exit(0))
    .catch(() => process.exit(1));

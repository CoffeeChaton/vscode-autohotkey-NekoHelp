/* eslint-disable no-magic-numbers */
import * as assert from 'node:assert';
import * as vscode from 'vscode';

// import * as myExtension from '../extension';

suite('Extension Test Suite 2', () => {
    void vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
    });
});

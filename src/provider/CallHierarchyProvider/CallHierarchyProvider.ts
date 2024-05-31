import type * as vscode from 'vscode';
import { CallHierarchy_core } from './CallHierarchy_core';
import { IncomingCalls } from './IncomingCalls';
import { OutgoingCalls } from './OutgoingCalls';

export const CallHierarchyProvider: vscode.CallHierarchyProvider = {
    /**
     * 1. set tree-root
     * 2. not rename it as prepareCallHierarchy..because it not good of use f12 (gotoDef)
     */
    prepareCallHierarchy: CallHierarchy_core,
    provideCallHierarchyIncomingCalls: IncomingCalls,
    provideCallHierarchyOutgoingCalls: OutgoingCalls,
};

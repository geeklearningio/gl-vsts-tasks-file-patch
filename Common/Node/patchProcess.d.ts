import patch = require('./patch');
export declare function expandVariablesAndParseJson(patchContent: string): patch.IPatch[];
export declare function expandVariablesAndParseSlickPatch(patchContent: string): patch.IPatch[];
export declare function apply(patcher: patch.IPatcher, workingDirectory: string, filters: string, outputPatchedFile: boolean): void;

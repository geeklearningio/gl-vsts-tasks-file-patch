import path = require('path');
import fs = require('fs-extra');
import tl = require('vsts-task-lib/task');
import micromatch = require('micromatch');

import patch = require('./common/patch');
import patchProcess = require('./common/patchProcess');
import jsonPatcher = require('./common/jsonPatcher');
import json5Patcher = require('./json5Patcher');

var targetPath = tl.getPathInput("JsonWorkingDir");
var patchContent = tl.getInput("JsonPatchContent");

var patterns: any = tl.getInput("JsonTargetFilters")
var outputPatchedFile = tl.getBoolInput("OutputPatchFile");
var syntax = tl.getInput("SyntaxType");
var useJson5 = tl.getBoolInput("UseJson5");

try {
    var patches: patch.IPatch[] = syntax == "slick" ? 
    patchProcess.expandVariablesAndParseSlickPatch(patchContent) :
    patchProcess.expandVariablesAndParseJson(patchContent);

    var patcher = useJson5 ? new json5Patcher.Json5Patcher(patches) : new jsonPatcher.JsonPatcher(patches);

    patchProcess.apply(patcher, targetPath, patterns, outputPatchedFile);

    tl.setResult(tl.TaskResult.Succeeded, "Files Patched");

} catch (err) {
    console.error(String(err));
    tl.setResult(tl.TaskResult.Failed, String(err));
}

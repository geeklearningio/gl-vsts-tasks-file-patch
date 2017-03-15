import path = require('path');
import fs = require('fs-extra');
import tl = require('vsts-task-lib/task');
import micromatch = require('micromatch');

import patch = require('./common/patch');
import patchProcess = require('./common/patchProcess');
import plistPatcher = require('./plistPatcher');

var targetPath = tl.getPathInput("PlistWorkingDir");
var patchContent = tl.getInput("PlistPatchContent");

var patterns: any = tl.getInput("PlistTargetFilters")
var outputPatchedFile = tl.getBoolInput("OutputPatchFile");
var failIfNoPatchApplied = tl.getBoolInput("FailIfNoPatchApplied");
var skipErrors = tl.getBoolInput("SkipErrors");
var syntax = tl.getInput("SyntaxType");

try {
    var patches: patch.IPatch[] = syntax == "slick" ?
        patchProcess.expandVariablesAndParseSlickPatch(patchContent) :
        patchProcess.expandVariablesAndParseJson(patchContent);

    patchProcess.apply(new plistPatcher.PlistPatcher(patches), targetPath, patterns, outputPatchedFile, failIfNoPatchApplied, skipErrors);

} catch (err) {
    console.error(String(err));
    tl.setResult(tl.TaskResult.Failed, String(err));
}

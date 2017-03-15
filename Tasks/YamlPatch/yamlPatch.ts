import path = require('path');
import fs = require('fs-extra');
import tl = require('vsts-task-lib/task');
import micromatch = require('micromatch');
import jsYaml = require('js-yaml');

import patch = require('./common/patch');
import patchProcess = require('./common/patchProcess');
import yamlPatcher = require('./yamlPatcher');

var targetPath = tl.getPathInput("YamlWorkingDir");
var patchContent = tl.getInput("YamlPatchContent");

var patterns: any = tl.getInput("YamlTargetFilters")
var outputPatchedFile = tl.getBoolInput("OutputPatchFile");
var failIfNoPatchApplied = tl.getBoolInput("FailIfNoPatchApplied");
var skipErrors = tl.getBoolInput("SkipErrors");
var syntax = tl.getInput("SyntaxType");

try {
    var patches: patch.IPatch[] = syntax == "slick" ?
        patchProcess.expandVariablesAndParseSlickPatch(patchContent) :
        patchProcess.expandVariablesAndParseJson(patchContent);

    patchProcess.apply(new yamlPatcher.YamlPatcher(patches), targetPath, patterns, outputPatchedFile, failIfNoPatchApplied, skipErrors);

} catch (err) {
    console.error(String(err));
    tl.setResult(tl.TaskResult.Failed, String(err));
}

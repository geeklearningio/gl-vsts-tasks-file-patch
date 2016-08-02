import path = require('path');
import fs = require('fs-extra');
import tl = require('vsts-task-lib/task');

import patch = require('./common/patch');
import patchProcess = require('./common/patchProcess');
import xmlPatcher = require('./xmlPatcher');

interface IPatch{
    op: string;
    path: string;
    value: any;
}


var targetPath = tl.getPathInput("JsonWorkingDir");
var patchContent = tl.getInput("JsonPatchContent");
var outputPatchedFile = tl.getBoolInput("OutputPatchFile");
var syntax = tl.getInput("SyntaxType");

var patterns: any = tl.getInput("JsonTargetFilters")

try {

    var namespaces = syntax == "slick" ? 
        xmlPatcher.loadNamespaces(tl.getInput("Namespaces")) : 
        JSON.parse(tl.getInput("Namespaces"));

    var patches: patch.IPatch[] = syntax == "slick" ? 
    patchProcess.expandVariablesAndParseSlickPatch(patchContent) :
    patchProcess.expandVariablesAndParseJson(patchContent);

    patchProcess.apply(new xmlPatcher.XmlPatcher(patches, namespaces), targetPath, patterns, outputPatchedFile);

    tl.setResult(tl.TaskResult.Succeeded, "Files Patched");
} catch (err) {
    console.error(String(err));
    tl.setResult(tl.TaskResult.Failed, String(err));
}
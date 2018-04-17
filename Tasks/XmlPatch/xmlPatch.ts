import path = require('path');
import fs = require('fs-extra');
import tl = require('vsts-task-lib/task');

import patchProcess = require('./common/patchProcess');
import xmlPatcher = require('./xmlPatcher');
import { Operation } from 'fast-json-patch';

interface IPatch{
    op: string;
    path: string;
    value: any;
}

var targetPath = tl.getPathInput("XmlWorkingDir");
var patchContent = tl.getInput("JsonPatchContent");
var outputPatchedFile = tl.getBoolInput("OutputPatchFile");
var failIfNoPatchApplied = tl.getBoolInput("FailIfNoPatchApplied");
var treatErrors = tl.getInput("TreatErrors");
var syntax = tl.getInput("SyntaxType");

var patterns: any = tl.getInput("XmlTargetFilters")

try {
    var namespaces: { [tag: string]: string } = syntax == "slick" ? 
        xmlPatcher.loadNamespaces(tl.getInput("Namespaces")) : 
        (namespaces ? JSON.parse(tl.getInput("Namespaces")) : {});

    var patches: Operation[] = syntax == "slick" ? 
    patchProcess.expandVariablesAndParseSlickPatch(patchContent) :
    patchProcess.expandVariablesAndParseJson(patchContent);

    patchProcess.apply(new xmlPatcher.XmlPatcher(patches, namespaces), targetPath, patterns, outputPatchedFile, failIfNoPatchApplied, treatErrors);

} catch (err) {
    console.error(String(err));
    tl.setResult(tl.TaskResult.Failed, String(err));
}
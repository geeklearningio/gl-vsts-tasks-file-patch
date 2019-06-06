import path = require('path');
import fs = require('fs-extra');
import * as tl from 'azure-pipelines-task-lib/task';
import micromatch = require('micromatch');

import patchProcess = require('./common/patchProcess');
import plistPatcher = require('./plistPatcher');
import { Operation } from 'fast-json-patch';

var targetPath = tl.getPathInput('PlistWorkingDir');
var patchContent = tl.getInput('PlistPatchContent');

var patterns: any = tl.getInput('PlistTargetFilters');
var outputPatchedFile = tl.getBoolInput('OutputPatchFile');
var failIfNoPatchApplied = tl.getBoolInput('FailIfNoPatchApplied');
var treatErrors = tl.getInput('TreatErrors');
var syntax = tl.getInput('SyntaxType');

try {
  var patches: Operation[] =
    syntax == 'slick'
      ? patchProcess.expandVariablesAndParseSlickPatch(patchContent)
      : patchProcess.expandVariablesAndParseJson(patchContent);

  patchProcess.apply(
    new plistPatcher.PlistPatcher(patches),
    targetPath,
    patterns,
    outputPatchedFile,
    failIfNoPatchApplied,
    treatErrors
  );
} catch (err) {
  console.error(String(err));
  tl.setResult(tl.TaskResult.Failed, String(err));
}

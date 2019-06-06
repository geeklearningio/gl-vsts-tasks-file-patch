import path = require("path");
import fs = require("fs-extra");
import tl = require("azure-pipelines-task-lib/task");
import micromatch = require("micromatch");

import patchProcess = require("./common/patchProcess");
import jsonPatcher = require("./common/jsonPatcher");
import json5Patcher = require("./json5Patcher");
import { Operation } from "fast-json-patch";

var targetPath = tl.getPathInput("JsonWorkingDir");
var patchContent = tl.getInput("JsonPatchContent");

var patterns: any = tl.getInput("JsonTargetFilters");
var outputPatchedFile = tl.getBoolInput("OutputPatchFile");
var failIfNoPatchApplied = tl.getBoolInput("FailIfNoPatchApplied");
var treatErrors = tl.getInput("TreatErrors");
var syntax = tl.getInput("SyntaxType");
var useJson5 = tl.getBoolInput("UseJson5");
var produceJson5 = tl.getBoolInput("ProduceJson5");

try {
  var patches: Operation[] =
    syntax == "slick"
      ? patchProcess.expandVariablesAndParseSlickPatch(patchContent)
      : patchProcess.expandVariablesAndParseJson(patchContent);

  var patcher = useJson5
    ? new json5Patcher.Json5Patcher(patches, produceJson5)
    : new jsonPatcher.JsonPatcher(patches);

  patchProcess.apply(
    patcher,
    targetPath,
    patterns,
    outputPatchedFile,
    failIfNoPatchApplied,
    treatErrors
  );
} catch (err) {
  tl.setResult(tl.TaskResult.Failed, err.toString());
}

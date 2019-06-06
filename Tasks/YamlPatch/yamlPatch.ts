import * as tl from "azure-pipelines-task-lib/task";

import patchProcess = require("./common/patchProcess");
import yamlPatcher = require("./yamlPatcher");
import { Operation } from "fast-json-patch";

var targetPath = tl.getPathInput("YamlWorkingDir");
var patchContent = tl.getInput("YamlPatchContent");

var patterns: any = tl.getInput("YamlTargetFilters");
var outputPatchedFile = tl.getBoolInput("OutputPatchFile");
var failIfNoPatchApplied = tl.getBoolInput("FailIfNoPatchApplied");
var treatErrors = tl.getInput("TreatErrors");
var syntax = tl.getInput("SyntaxType");

try {
  var patches: Operation[] =
    syntax == "slick"
      ? patchProcess.expandVariablesAndParseSlickPatch(patchContent)
      : patchProcess.expandVariablesAndParseJson(patchContent);

  patchProcess.apply(
    new yamlPatcher.YamlPatcher(patches),
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

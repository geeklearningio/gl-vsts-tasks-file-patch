import * as tl from 'azure-pipelines-task-lib/task';

import patchProcess = require('./common/patchProcess');
import jsonPatcher = require('./common/jsonPatcher');
import json5Patcher = require('./json5Patcher');
import { Operation } from 'fast-json-patch';

try {
  var targetPath = tl.getPathInput('JsonWorkingDir', true);
  var patchContent = tl.getInput('JsonPatchContent', true);

  var patterns: string = tl.getInput('JsonTargetFilters', true);
  var outputPatchedFile = tl.getBoolInput('OutputPatchFile', true);
  var failIfNoPatchApplied = tl.getBoolInput('FailIfNoPatchApplied', true);
  var treatErrors = tl.getInput('TreatErrors', true);
  var syntax = tl.getInput('SyntaxType', true);
  var useJson5 = tl.getBoolInput('UseJson5', true);
  var produceJson5 = tl.getBoolInput('ProduceJson5', true);

  var patches: Operation[] =
    syntax == 'slick'
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

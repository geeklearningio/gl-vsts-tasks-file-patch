import bom = require('./bom');
import patch = require('./patch');
import matcher = require('./multimatch');
import * as tl from 'azure-pipelines-task-lib/task';
import fs = require('fs');
import * as sh from 'shelljs';
import { Operation } from 'fast-json-patch';

var slickPatchParser = new patch.SlickPatchParser();
var varRegex = /\$\((.*?)\)/g;

function expandVariable(str: string): string {
  return str.replace(varRegex, (match, varName, offset, string) =>
    tl.getVariable(varName)
  );
}

export function expandVariablesAndParseJson(patchContent: string): Operation[] {
  return JSON.parse(expandVariable(patchContent));
}

export function expandVariablesAndParseSlickPatch(
  patchContent: string
): Operation[] {
  return slickPatchParser.parse(expandVariable(patchContent));
}

export function apply(
  patcher: patch.IPatcher,
  workingDirectory: string,
  filters: string,
  outputPatchedFile: boolean,
  failIfNoPatchApplied: boolean,
  treatErrors: string
): void {
  var files = matcher.getMatches(workingDirectory, filters);

  for (var index = 0; index < patcher.patches.length; index++) {
    var patch = patcher.patches[index];
    if (
      (patch.path && patch.path[0] != '/') ||
      ((patch as any).from && (patch as any).from[0] != '/')
    ) {
      throw new Error(
        'All path must start with a leading slash. Please verify patch at index ' +
          String(index)
      );
    }
  }

  tl.debug('Attempt to patch ' + String(files.length) + 'files');

  var filePatched = 0;
  var errors = 0;

  for (var index = 0; index < files.length; index++) {
    var file = files[index];
    tl.debug('Attempt patching file : ' + file);

    var fileContent = bom.removeBom(
      fs.readFileSync(file, { encoding: 'utf8' })
    );

    try {
      fileContent.content = patcher.apply(fileContent.content);

      console.log(file + ' successfully patched.');
      if (outputPatchedFile) {
        console.log('>>>> patched file content:');
        console.log(fileContent.content);
      }

      // make the file writable (required if using TFSVC)
      sh.chmod(666, file);

      fs.writeFileSync(file, bom.restoreBom(fileContent), { encoding: 'utf8' });
      filePatched++;
    } catch (err) {
      tl.debug(String(err));

      /* NONE means it never happened. */
      if (treatErrors != 'NONE') {
        errors++;

        var msg = "Couldn't apply patch to file: " + file;

        if (treatErrors == 'ERROR') {
          tl.error(msg);
        } else if (treatErrors == 'WARN') {
          tl.warning(msg);
        } else if (treatErrors == 'INFO') {
          tl.debug(msg);
        }
      }
    }
  }

  if (!files.length) {
    var msg =
      'Patch was not applied because there are no files matching the provided patterns in the specified directory';

    if (treatErrors == 'ERROR') {
      tl.error(msg);
    } else if (treatErrors == 'WARN') {
      tl.warning(msg);
    } else if (treatErrors == 'INFO') {
      tl.debug(msg);
    }
  }

  var msg = String(filePatched) + ' files patched successfully';

  if (errors > 0) {
    if (treatErrors == 'ERROR') {
      msg += ' and ' + String(errors) + ' errors.';
    } else if (treatErrors == 'WARN') {
      msg += ' and ' + String(errors) + ' warnings.';
    } else if (treatErrors == 'INFO') {
      msg += ' and ' + String(errors) + ' messages.';
    }
  }

  tl.debug(msg);

  if (failIfNoPatchApplied && filePatched === 0) {
    tl.setResult(tl.TaskResult.Failed, 'No files were patched.');
  } else if (treatErrors == 'ERROR' && errors > 0) {
    tl.setResult(
      tl.TaskResult.Failed,
      'Failed to successfully patch one or more files.'
    );
  } else {
    tl.setResult(tl.TaskResult.Succeeded, 'Files patched.');
  }
}

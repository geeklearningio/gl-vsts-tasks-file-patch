import bom = require('./shared/bom')
import patch = require('./patch');
import matcher = require('./shared/multimatch');
import tl = require('vsts-task-lib/task');
import fs = require('fs');
import * as sh from 'shelljs';
import { Operation } from 'fast-json-patch';

var slickPatchParser = new patch.SlickPatchParser();
var varRegex = /\$\((.*?)\)/g;

function expandVariable(str: string) {
    return str.replace(varRegex, (match, varName, offset, string) => tl.getVariable(varName));
}

export function expandVariablesAndParseJson(patchContent: string): Operation[] {
    return JSON.parse(expandVariable(patchContent));
}

export function expandVariablesAndParseSlickPatch(patchContent: string): Operation[] {
    return slickPatchParser.parse(expandVariable(patchContent));
}

export function apply(patcher: patch.IPatcher, workingDirectory: string, filters: string,
    outputPatchedFile: boolean, failIfNoPatchApplied: boolean, skipErrors: boolean) {
    var files = matcher.getMatches(workingDirectory, filters);

    for (var index = 0; index < patcher.patches.length; index++) {
        var patch = patcher.patches[index];
        if (patch.path && patch.path[0] != '/'
            || (<any>patch).from && (<any>patch).from[0] != '/')
        {
            throw new Error("All path must start with a leading slash. Please verify patch at index " + String(index));
        }
    }

    tl.debug("Attempt to patch " + String(files.length) + "files");

    var filePatched = 0;
    var errors = 0;

    for (var index = 0; index < files.length; index++) {
        var file = files[index];
        tl.debug("Attempt patching file : " + file)

        var fileContent = bom.removeBom(fs.readFileSync(file, { encoding: 'utf8' }));

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
        }
        catch (err) {
            tl.warning(String(err));
            tl.warning("Couldn't apply patch to file: " + file);
            errors++;
        }

    }
    if (!files.length) {
        tl.warning("Patch was not applied because there are no file is matching the provided patterns in the specified directory");
    }

    tl.debug(String(filePatched) + " files patched successfully and " + String(errors) + " errors.")

    if (failIfNoPatchApplied && filePatched === 0) {
        tl.setResult(tl.TaskResult.Failed, "No files have been successfully patched");
    } else if (!skipErrors && errors > 0) {
        tl.setResult(tl.TaskResult.Failed, "Failed to patch all files successfully");
    } else {
        tl.setResult(tl.TaskResult.Succeeded, "Files Patched");
    }
}
import bom = require('./bom')
import patch = require('./patch');
import matcher = require('./matcher');
import tl = require('vsts-task-lib/task');
import fs = require('fs');

var slickPatchParser = new patch.SlickPatchParser();
var varRegex = /\$\((.*?)\)/g;

function expandVariable(str: string){
    return str.replace(varRegex, (match, varName, offset, string) => tl.getVariable(varName));
}

export function expandVariablesAndParseJson(patchContent: string) : patch.IPatch[] {
    return JSON.parse(expandVariable(patchContent));
}

export function expandVariablesAndParseSlickPatch(patchContent: string): patch.IPatch[] {
    return slickPatchParser.parse(expandVariable(patchContent));    
}

export function apply(patcher: patch.IPatcher, workingDirectory: string, filters: string, outputPatchedFile: boolean){
    var files = matcher.getMatches(workingDirectory, filters);
    for (var index = 0; index < files.length; index++) {
        var file = files[index];

        var fileContent = bom.removeBom(fs.readFileSync(file, { encoding: 'utf8' }));

        fileContent.content = patcher.apply(fileContent.content);

        console.log(file + ' successfully patched.');
        if (outputPatchedFile){
            console.log('>>>> : patched file');
            console.log(fileContent.content);
        }

        fs.writeFileSync(file, bom.restoreBom(fileContent), { encoding: 'utf8' });
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bom = require("./shared/bom");
var patch = require("./patch");
var matcher = require("./shared/multimatch");
var tl = require("vsts-task-lib/task");
var fs = require("fs");
var slickPatchParser = new patch.SlickPatchParser();
var varRegex = /\$\((.*?)\)/g;
function expandVariable(str) {
    return str.replace(varRegex, function (match, varName, offset, string) { return tl.getVariable(varName); });
}
function expandVariablesAndParseJson(patchContent) {
    return JSON.parse(expandVariable(patchContent));
}
exports.expandVariablesAndParseJson = expandVariablesAndParseJson;
function expandVariablesAndParseSlickPatch(patchContent) {
    return slickPatchParser.parse(expandVariable(patchContent));
}
exports.expandVariablesAndParseSlickPatch = expandVariablesAndParseSlickPatch;
function apply(patcher, workingDirectory, filters, outputPatchedFile) {
    var files = matcher.getMatches(workingDirectory, filters);
    for (var index = 0; index < files.length; index++) {
        var file = files[index];
        var fileContent = bom.removeBom(fs.readFileSync(file, { encoding: 'utf8' }));
        fileContent.content = patcher.apply(fileContent.content);
        console.log(file + ' successfully patched.');
        if (outputPatchedFile) {
            console.log('>>>> : patched file');
            console.log(fileContent.content);
        }
        fs.writeFileSync(file, bom.restoreBom(fileContent), { encoding: 'utf8' });
    }
    if (!files.length) {
        tl.warning("Patch was not applied because there are no file matching the provided patterns in the specified directory");
    }
}
exports.apply = apply;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0Y2hQcm9jZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGF0Y2hQcm9jZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0NBQW9DO0FBQ3BDLCtCQUFrQztBQUNsQyw2Q0FBZ0Q7QUFDaEQsdUNBQTBDO0FBQzFDLHVCQUEwQjtBQUUxQixJQUFJLGdCQUFnQixHQUFHLElBQUksS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDcEQsSUFBSSxRQUFRLEdBQUcsY0FBYyxDQUFDO0FBRTlCLHdCQUF3QixHQUFXO0lBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sSUFBSyxPQUFBLEVBQUUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQztBQUM5RixDQUFDO0FBRUQscUNBQTRDLFlBQW9CO0lBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ3BELENBQUM7QUFGRCxrRUFFQztBQUVELDJDQUFrRCxZQUFvQjtJQUNsRSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFGRCw4RUFFQztBQUVELGVBQXNCLE9BQXVCLEVBQUUsZ0JBQXdCLEVBQUUsT0FBZSxFQUFFLGlCQUEwQjtJQUNoSCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO1FBQ2hELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU3RSxXQUFXLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXpELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLHdCQUF3QixDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQSxDQUFDO1FBQ2YsRUFBRSxDQUFDLE9BQU8sQ0FBQywyR0FBMkcsQ0FBQyxDQUFDO0lBQzVILENBQUM7QUFDTCxDQUFDO0FBcEJELHNCQW9CQyJ9
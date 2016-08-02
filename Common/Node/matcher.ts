import micromatch = require('micromatch');
import tl = require('vsts-task-lib/task');
import path = require('path');

export function getMatches(directory: string, filters: string) : string[] {
    var patterns = filters.split("\n").map((pattern) => path.join(directory, pattern));
    var allFiles = tl.find(directory).map(file => path.resolve(file));
    var files = allFiles.filter(micromatch.filter(patterns, { nodupes: true }));
    return files;
}
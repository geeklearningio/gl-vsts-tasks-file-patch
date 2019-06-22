import micromatch = require('micromatch');
import path = require('path');
import * as tl from 'azure-pipelines-task-lib/task';

export function applyMatch(
  directory: string,
  filters: string,
  files: string[]
): string[] {
  var patterns = filters.split('\n').map(pattern => {
    if (pattern.match(/^!/)) {
      return '!' + path.join(directory, pattern.substr(1));
    }
    return path.join(directory, pattern);
  });

  var allFiles = files.map(file => path.resolve(file));
  var filteredFiles = (micromatch as any)(allFiles, patterns, {
    nodupes: true
  });
  return filteredFiles;
}

export function getMatches(directory: string, filters: string): string[] {
  return applyMatch(directory, filters, tl.find(directory));
}

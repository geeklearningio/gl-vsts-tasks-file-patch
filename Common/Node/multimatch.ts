import micromatch = require('micromatch');
import path = require('path');
import * as tl from 'azure-pipelines-task-lib/task';

export function applyMatch(
  directory: string,
  filters: string,
  files: string[]
): string[] {
  var patterns = filters.split('\n');

  var allFiles = files.map(file => path.relative(directory, file));
  var filteredFiles = micromatch(allFiles, patterns, {});
  return filteredFiles.map(file => path.join(directory, file));
}

export function getMatches(directory: string, filters: string): string[] {
  return applyMatch(directory, filters, tl.find(directory));
}

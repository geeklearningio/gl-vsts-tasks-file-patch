import { IPatcher, SlickPatchParser } from './patch';
import * as tl from 'azure-pipelines-task-lib/task';
import * as jsonPatch from 'fast-json-patch';

export class JsonPatcher implements IPatcher {
  constructor(public patches: jsonPatch.Operation[]) {}

  protected parse(content: string): any {
    return JSON.parse(content);
  }

  protected stringify(content: any): string {
    return JSON.stringify(content, null, 4);
  }

  apply(content: string): string {
    var json = this.parse(content);
    var patchError = jsonPatch.validate(this.patches, json);

    if (patchError) {
      tl.warning(
        'Invalid patch at index `' +
          String(patchError.index) +
          '`' +
          '\n' +
          SlickPatchParser.stringify(patchError.operation) +
          '\n' +
          patchError.name +
          '\n' +
          patchError.message
      );
      throw new Error(
        'Invalid patch at index `' +
          String(patchError.index) +
          '`: ' +
          patchError.name +
          ', ' +
          patchError.message
      );
    }

    var result = jsonPatch.applyPatch(json, this.patches, false);
    if (result) {
      return this.stringify(json);
    } else {
      throw new Error('Failed to apply patch');
    }
  }
}

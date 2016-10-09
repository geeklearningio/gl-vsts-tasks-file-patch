import jsonPatcher = require('./common/jsonPatcher');
import patch = require('./common/patch');
var JSON5 = require('json5');

export class Json5Patcher extends jsonPatcher.JsonPatcher {

    parse(content: string): any {
        return JSON5.parse(content);
    }

    stringify(content: any): string {
        return JSON5.stringify(content);
    }
}
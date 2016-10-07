import jsonPatcher = require('./common/jsonPatcher');
import patch = require('./common/patch');
var plist = require('plist');

export class PlistPatcher extends jsonPatcher.JsonPatcher {

    parse(content: string): any {
        return plist.parse(content);
    }

    stringify(content: any): string {
        return plist.build(content);
    }
}
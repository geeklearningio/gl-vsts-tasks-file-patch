import jsonPatcher = require('./common/jsonPatcher');
import patch = require('./common/patch');
var plist = require('plist');

export class PlistPatcher extends jsonPatcher.JsonPatcher {

    constructor(patches: patch.IPatch[]) {
        super(patches, (content) => plist.parse(content));
    }
}
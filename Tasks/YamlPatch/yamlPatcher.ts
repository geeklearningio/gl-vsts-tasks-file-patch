import jsYaml = require('js-yaml');
import jsonPatcher = require('./common/jsonPatcher');
import patch = require('./common/patch');

export class YamlPatcher extends jsonPatcher.JsonPatcher {

    constructor(patches: patch.IPatch[]) {
        super(patches, (content) => jsYaml.safeLoad(content));
    }
}
import jsYaml = require('js-yaml');
import jsonPatcher = require('./common/jsonPatcher');
import patch = require('./common/patch');

export class YamlPatcher extends jsonPatcher.JsonPatcher {

    parse(content: string): any {
        return jsYaml.safeLoad(content);
    }

    stringify(content: any): string {
        return jsYaml.safeDump(content);
    }
}
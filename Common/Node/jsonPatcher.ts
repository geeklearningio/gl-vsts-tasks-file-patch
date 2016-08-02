import patch = require('./patch');

var jsonPatch = require('fast-json-patch');

export class JsonPatcher implements patch.IPatcher {
    constructor(private patches: patch.IPatch[]) {
        
    }

    apply(content: string): string {
        var json = JSON.parse(content);
        var prevalidate = jsonPatch.validate(this.patches, json);
        var result = jsonPatch.apply(json, this.patches, false);
        if (result) {
            return JSON.stringify(json);
        } else {
            throw new Error('Failed to apply patch')
        }
    }
}
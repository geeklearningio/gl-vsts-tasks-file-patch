import patch = require('./patch');

var jsonPatch = require('fast-json-patch');

export class JsonPatcher implements patch.IPatcher {
    constructor(
        private patches: patch.IPatch[]
    ) {
    }

    protected parse(content: string): any {
        return JSON.parse(content);
    }

    protected stringify(content: any): string {
        return JSON.stringify(content);
    }

    apply(content: string): string {
        var json = this.parse(content);
        var prevalidate = jsonPatch.validate(this.patches, json);
        var result = jsonPatch.apply(json, this.patches, false);
        if (result) {
            return this.stringify(json);
        } else {
            throw new Error('Failed to apply patch')
        }
    }
}
import patch = require('./patch');
export declare class JsonPatcher implements patch.IPatcher {
    private patches;
    constructor(patches: patch.IPatch[]);
    protected parse(content: string): any;
    protected stringify(content: any): string;
    apply(content: string): string;
}
